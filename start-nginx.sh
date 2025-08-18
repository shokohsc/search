#!/usr/bin/env bash
set -e

JSON_STRING='window.configs = { \
  "ENV":"'"${ENV}"'", \
  "USE_SENTRY":"'"${USE_SENTRY}"'", \
  "SENTRY_DSN":"'"${SENTRY_DSN}"'", \
  "API_URL":"'"${API_URL}"'" \
}'

if [[ $ENV == 'production' ]]; then
  sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html && \
  nginx -g 'daemon off;'
else
  echo "${JSON_STRING}" && \
  sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /app/index.html && \
  npm run $@
fi
