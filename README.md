# mazete

run the production server:

npm install
npm run build

# on nginx
sudo cp -r dist/* /var/www/html/

# on docker (nginx)
cp -r dist .docker/
# cp .htaccess docker/
cd .docker
sudo docker build -t mazete-front ./ --no-cache=true
sudo docker run -p 80:80 mazete-front

# on cloud run
# https://zenn.dev/hayatoomori/articles/83880221350f7e#google-container-registory%E3%81%ABimage%E3%82%92push%E3%81%99%E3%82%8B