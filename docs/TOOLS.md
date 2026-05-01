# Tool Catalog

This server exposes tools grouped by API domain.

## Statistics Tools

- `swetrix_stats_log`: Aggregated traffic stats.
- `swetrix_stats_performance`: Aggregated performance stats.
- `swetrix_stats_birdseye`: Summary metrics.
- `swetrix_stats_custom_events`: Custom event aggregates.
- `swetrix_stats_profiles`: Profile list.
- `swetrix_stats_profile`: Single profile details.
- `swetrix_stats_errors`: Error groups.
- `swetrix_stats_error_detail`: One error group detail.
- `swetrix_stats_filters`: Dimension filters (traffic/errors).

## Event Tools

- `swetrix_events_pageview`: Send pageview event.
- `swetrix_events_custom`: Send custom event.
- `swetrix_events_heartbeat`: Send heartbeat event.
- `swetrix_events_error`: Send error event.
- `swetrix_events_revenue`: Send revenue transaction.

## Admin Tools

### Projects

- `swetrix_admin_list_projects`
- `swetrix_admin_get_project`
- `swetrix_admin_create_project`
- `swetrix_admin_update_project`
- `swetrix_admin_delete_project`
- `swetrix_admin_pin_project`

### Project Management Sets

- `swetrix_admin_project_views` (`list|get|create|update|delete`)
- `swetrix_admin_project_annotations` (`list|create|update|delete`)
- `swetrix_admin_project_funnels` (`list|create|update|delete`)

### Organisations

- `swetrix_admin_list_organisations`
- `swetrix_admin_get_organisation`
- `swetrix_admin_create_organisation`
- `swetrix_admin_update_organisation`
- `swetrix_admin_delete_organisation`
- `swetrix_admin_invite_member`
- `swetrix_admin_update_member`
- `swetrix_admin_remove_member`

## Common Parameters

- `apiKey` (optional): Override `SWETRIX_API_KEY` per call.
- `projectId`/`pid`: Swetrix project identifier.
- `period`, `from`, `to`, `timeBucket`: Time-range controls for stats.

## Return Shape

Most tools return:

```json
{
  "data": {}
}
```

If the upstream API fails, the tool returns an MCP-visible error message with the HTTP status included.

