# Green Resourcerers MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes the Green Resourcerers backend API as tools for AI assistants such as Claude.

## Tools

### Service Requests
| Tool | Description |
|---|---|
| `create_service_request` | Submit a new satellite-dish removal request from a homeowner |
| `list_service_requests` | List all service requests (supports pagination) |
| `get_service_request` | Retrieve a single request by ID |
| `update_service_request` | Update a request's status or description |

### Technicians
| Tool | Description |
|---|---|
| `create_technician` | Register a new field technician |
| `list_technicians` | List all technicians (supports pagination) |
| `get_technician` | Retrieve a single technician by ID |
| `update_technician` | Update a technician's details or active status |

### Jobs
| Tool | Description |
|---|---|
| `create_job` | Assign a service request to a technician |
| `list_jobs` | List all jobs (supports pagination) |
| `get_job` | Retrieve a single job by ID |
| `update_job` | Update a job's status, notes, or scheduled date |

## Setup

### Prerequisites

- Python 3.11+
- The [backend API](../backend-api/) running and accessible

### Install

```bash
cd mcp-server
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Configure

Copy `.env.example` to `.env` and set `API_BASE_URL` to the address of the running backend:

```bash
cp .env.example .env
# Edit .env if the backend is not at http://localhost:8000
```

### Run (stdio transport — default for MCP clients)

```bash
python server.py
```

## Connecting to Claude Desktop

Add the following block to your `claude_desktop_config.json` (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "green-resourcerers": {
      "command": "python",
      "args": ["/absolute/path/to/mcp-server/server.py"],
      "env": {
        "API_BASE_URL": "http://localhost:8000"
      }
    }
  }
}
```

## Status values

| Entity | Valid statuses |
|---|---|
| Service Request | `pending`, `approved`, `in_progress`, `completed` |
| Job | `assigned`, `in_progress`, `completed` |
