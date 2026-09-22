#!/usr/bin/env python3
"""Recursively SITE CHMOD a remote FTP tree.

exFAT / noowners volumes cannot store Unix modes, so FTP uploads (especially
lftp mirror permission sync) often land as 700. Apache then returns 403.

Critical Cafe24/Apache trap: if `.htaccess` is mode 700, Apache cannot read it
and returns 403 for the *entire* directory — including assets that are already
644. Plain `NLST` hides dotfiles, so older chmod walks skipped `.htaccess`.

Usage:
  set -a; source ~/.config/onoffmarketing/ftp.env; set +a
  python3 scripts/ftp-chmod-tree.py seo-system-300
  python3 scripts/ftp-chmod-tree.py seo-system-300 --dir-mode 755 --file-mode 644
"""
from __future__ import annotations

import argparse
import ftplib
import os
import sys

# Always attempt these even when directory listings omit dotfiles.
DOTFILES = (".htaccess", ".htpasswd")


def load_env() -> dict[str, str]:
    env = dict(os.environ)
    path = os.path.expanduser("~/.config/onoffmarketing/ftp.env")
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env[key] = value.strip().strip('"').strip("'")
    return env


def site_chmod(ftp: ftplib.FTP, mode: str, path: str) -> bool:
    try:
        ftp.sendcmd(f"SITE CHMOD {mode} {path}")
        return True
    except ftplib.error_perm:
        return False


def list_entries(ftp: ftplib.FTP) -> list[tuple[str, bool]]:
    """Return [(name, is_dir), ...] including dotfiles when the server allows."""
    entries: list[tuple[str, bool]] = []
    seen: set[str] = set()

    def add(name: str, is_dir: bool) -> None:
        base = name.rsplit("/", 1)[-1]
        if not base or base in (".", "..") or base.startswith("._") or base == ".DS_Store":
            return
        if base in seen:
            return
        seen.add(base)
        entries.append((base, is_dir))

    # Prefer LIST — includes type bit and often shows .htaccess.
    lines: list[str] = []
    try:
        ftp.retrlines("LIST", lines.append)
    except ftplib.error_perm:
        lines = []

    for line in lines:
        parts = line.split(maxsplit=8)
        if len(parts) < 9:
            continue
        name = parts[8]
        is_dir = line.startswith("d")
        add(name, is_dir)

    if entries:
        return entries

    # Fallback: NLST / NLST -a
    for cmd in ("NLST -a", "NLST"):
        names: list[str] = []
        try:
            ftp.retrlines(cmd, names.append)
        except ftplib.error_perm:
            continue
        for name in names:
            base = name.rsplit("/", 1)[-1]
            if not base or base in (".", ".."):
                continue
            is_dir = False
            cwd = ftp.pwd()
            try:
                ftp.cwd(base)
                ftp.cwd(cwd)
                is_dir = True
            except ftplib.error_perm:
                is_dir = False
            add(base, is_dir)
        if entries:
            break

    return entries


def walk_chmod(ftp: ftplib.FTP, remote_abs: str, dir_mode: str, file_mode: str) -> tuple[int, int]:
    dirs = 0
    files = 0
    if site_chmod(ftp, dir_mode, remote_abs):
        dirs += 1
    ftp.cwd(remote_abs)

    for dot in DOTFILES:
        child = f"{remote_abs.rstrip('/')}/{dot}"
        if site_chmod(ftp, file_mode, child):
            files += 1

    for base, is_dir in list_entries(ftp):
        child = f"{remote_abs.rstrip('/')}/{base}"
        if is_dir:
            d, f = walk_chmod(ftp, child, dir_mode, file_mode)
            dirs += d
            files += f
            ftp.cwd(remote_abs)
        else:
            if site_chmod(ftp, file_mode, child):
                files += 1
    return dirs, files


def main() -> int:
    parser = argparse.ArgumentParser(description="FTP SITE CHMOD tree for web-served assets")
    parser.add_argument("remote_rel", help="Path under FTP remote root, e.g. seo-system-300")
    parser.add_argument("--remote-root", default="")
    parser.add_argument("--dir-mode", default="755")
    parser.add_argument("--file-mode", default="644")
    args = parser.parse_args()

    env = load_env()
    for key in ("FTP_SERVER", "FTP_USERNAME", "FTP_PASSWORD"):
        if not env.get(key):
            print(f"ERROR: {key} is not set", file=sys.stderr)
            return 2

    remote_root = (args.remote_root or env.get("FTP_REMOTE_ROOT") or "/public_html").rstrip("/")
    target = f"{remote_root}/{args.remote_rel.strip('/')}".replace("//", "/")
    port = int(env.get("FTP_PORT") or 21)

    ftp = ftplib.FTP()
    ftp.connect(env["FTP_SERVER"], port, timeout=60)
    ftp.login(env["FTP_USERNAME"], env["FTP_PASSWORD"])
    try:
        print(f"[ftp-chmod] target={target} dirs={args.dir_mode} files={args.file_mode}")
        dirs, files = walk_chmod(ftp, target, args.dir_mode, args.file_mode)
        print(f"[ftp-chmod] done dirs={dirs} files={files} (includes dotfiles if present)")
    finally:
        try:
            ftp.quit()
        except Exception:
            ftp.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
