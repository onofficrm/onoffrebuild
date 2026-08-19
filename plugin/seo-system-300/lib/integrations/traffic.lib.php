<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_traffic_tool_getStatus($project_id)
{
    $reg = seosys300_tool_registry_item('traffic');
    return seosys300_adapter_get_status('traffic', seosys300_tool_row($project_id, 'traffic'), $reg);
}

function seosys300_traffic_tool_sync($project_id)
{
    unset($project_id);
    return seosys300_adapter_sync('traffic');
}
