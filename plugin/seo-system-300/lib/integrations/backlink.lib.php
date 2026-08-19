<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_backlink_tool_getStatus($project_id)
{
    $reg = seosys300_tool_registry_item('backlink');
    return seosys300_adapter_get_status('backlink', seosys300_tool_row($project_id, 'backlink'), $reg);
}

function seosys300_backlink_tool_sync($project_id)
{
    unset($project_id);
    return seosys300_adapter_sync('backlink');
}
