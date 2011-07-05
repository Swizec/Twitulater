cd /home/swizec/Documents/Twitulater/compiling
rm -rf "source" "binary" "app"
svn export -q http://3pike.org/twitulator/app
mv "app" "source"
mkdir "binary"
cd "source"
php ../nightly.php

/home/swizec/airsdk/bin/adt -package -storetype pkcs12 -keystore ../twitulatercert.p12 -storepass ot\&jayog ../binary/Twitulater_nightly.air descriptor.xml .

cd ../binary
scp -i /home/swizec/.ssh/id_rsa Twitulater_nightly.air 3pike.org:twitulater.com/Twitulater_nightly.air