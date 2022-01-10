 export AWS_SDK_LOAD_CONFIG=true

curl --request POST \
  --url 'https://dev-73ha-690.jp.auth0.com/oauth/token' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type=password \
  --data username=najim.ju@gmail.com \
  --data password= \
  --data scope=openid \
  --data 'client_id=b8h7maXhL2I3Ln5IKnTHvL9KjK6IxLnn'