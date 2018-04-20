REM import content to local
mongoimport -h 127.0.0.1:27017 -d appdb -c content --drop --file d:/mlab/content.json --jsonArray

REM import content to remote
mongoimport -h ds255787.mlab.com:55787 -d heroku_td0ff82c -c content --drop -u heroku_td0ff82c -p fers9rhokmk5fpe2t66mf0pj09 --file d:/mlab/content.json --jsonArray

REM import UI to local
mongoimport -h 127.0.0.1:27017 -d appdb -c ui --drop --file d:/mlab/ui.json --jsonArray

REM import UI to remote
mongoimport -h ds255787.mlab.com:55787 -d heroku_td0ff82c -c ui --drop -u heroku_td0ff82c -p fers9rhokmk5fpe2t66mf0pj09 --file d:/mlab/ui.json --jsonArray
