#!/bin/bash

# Docker management scripts for PostgreSQL

case "$1" in
  "start")
    echo "Starting PostgreSQL container..."
    docker-compose up -d
    echo "PostgreSQL is starting up. Use 'docker-compose logs -f postgres' to see logs."
    ;;
  "stop")
    echo "Stopping PostgreSQL container..."
    docker-compose down
    ;;
  "restart")
    echo "Restarting PostgreSQL container..."
    docker-compose restart
    ;;
  "reset")
    echo "Resetting PostgreSQL with fresh data..."
    docker-compose down -v
    docker-compose up -d
    echo "PostgreSQL reset complete with fresh data."
    ;;
  "logs")
    docker-compose logs -f postgres
    ;;
  "shell")
    echo "Connecting to PostgreSQL shell..."
    docker-compose exec postgres psql -U api_user -d api_db
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|reset|logs|shell}"
    echo ""
    echo "Commands:"
    echo "  start   - Start PostgreSQL container"
    echo "  stop    - Stop PostgreSQL container"
    echo "  restart - Restart PostgreSQL container"
    echo "  reset   - Reset PostgreSQL with fresh data (removes all data)"
    echo "  logs    - Show PostgreSQL logs"
    echo "  shell   - Connect to PostgreSQL shell"
    ;;
esac