# Use the official PostgreSQL image
FROM postgres:15-alpine

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=sci \
    POSTGRES_PASSWORD=sci \
    POSTGRES_DB=sci

# Expose the PostgreSQL port
EXPOSE 5432

# Optional: Copy an SQL initialization script (if any)
# COPY init.sql /docker-entrypoint-initdb.d/

# Start PostgreSQL
CMD ["postgres"]
