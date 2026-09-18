<?php
namespace OnoffMarketing\BrandedAuth;

final class BrandedAuthException extends \RuntimeException
{
    public string $errorCode;
    public int $httpStatus;

    public function __construct(string $message, string $errorCode, int $httpStatus = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, 0, $previous);
        $this->errorCode = AuthErrors::normalizeCoreCode($errorCode);
        $this->httpStatus = $httpStatus > 0 ? $httpStatus : AuthErrors::httpStatus($this->errorCode);
    }
}
