<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_catchdomain_getStatus($project_id)
{
    $reg = seosys300_tool_registry_item('catchdomain');
    return seosys300_adapter_get_status('catchdomain', seosys300_tool_row($project_id, 'catchdomain'), $reg);
}

function seosys300_catchdomain_sync($project_id)
{
    unset($project_id);
    return seosys300_adapter_sync('catchdomain');
}
