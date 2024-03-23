# Run migrations
node ace migration:fresh

# Run seeders
## For production
node ace db:seed -f database/seeders/0_start_seeder.ts

## For development
node ace db:seed