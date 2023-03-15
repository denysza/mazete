# mazete

run the production server:

npm install  
npm run build

## on nginx
sudo cp -r dist/* /var/www/html/

## install docker
https://www.softek.co.jp/SID/support/sidfmvm/guide/install-docker-ubuntu1804.html

## on docker (nginx)
cp -r dist .docker/  
cd .docker  
sudo docker build -t mazete-front ./ --no-cache=true  
sudo docker run -d -p 80:80 mazete-front  
更新のときは一旦停止する必要がある（もっとスマートな方法はないか）  
sudo docker stop $(sudo docker ps -q)

## on cloud run
https://zenn.dev/hayatoomori/articles/83880221350f7e#google-container-registory%E3%81%ABimage%E3%82%92push%E3%81%99%E3%82%8B  
ただし、dockerのpush先はcontainer registryではなくartifact registryの方が良さそう  
gcpの管理画面でartifact registryを有効にするとチュートリアルができるのでpushするイメージだけ差し替えて実行  
ただし、チュートリアル通りにやっても認証がうまく行かず、以下のページに従ってサービスアカウントにartifact  registryのロールを付与し認証  
https://cloud.google.com/container-registry/docs/advanced-authentication  
認証が本当に必要だったのかははっきりしない

## on aws s3+cloudfront
sudo apt install awscli  
aws configure
cd dist
aws s3 sync ./ s3://mazete-front  
以後は  
https://qiita.com/kskinaba/items/dcf68b32ddaebc904929