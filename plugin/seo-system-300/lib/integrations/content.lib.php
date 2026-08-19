<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_content_tool_getStatus($project_id)
{
    $reg = seosys300_tool_registry_item('content');
    return seosys300_adapter_get_status('content', seosys300_tool_row($project_id, 'content'), $reg);
}

function seosys300_content_tool_sync($project_id)
{
    unset($project_id);
    return seosys300_adapter_sync('content');
}
