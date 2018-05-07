This is an on going project for on going self learning

As with any self learning project there has been project/learning creep (There is always alot to learn).

+ Starting with investigating Google ServerLess
+ Learning Node (Serverless only supported Node)
+ Choosing an IDE
  + IDE addons and tools
+ Handling Node Version Manager
+ Created a project to query a domain and collect dns related data
+ Handling Async queries
+ Publishing app to google serverless and troubleshooting
  + I ended up opening a bug with serverless
+ Get it Done
  + Time management
  + Perfection is another form of procrastition
  + Jumping platforms Windows/Ubuntu 16/Centos/Ubuntu18
+ Moving to Google App Engine (Hybrid)
  + Defaults to spec B1 @ 5c an hour ($36 a month)!

## To Do
+ Refactor the code - there is alot of repeated code - use map/reduce not for loops
+ Add Unit Test
+ Add Status (maybe get environment variables, add a counter for hits.)
+ Setup CI process
+ GCP Version control\testing,
+ Add some more features
  + Geo Location the IP addresses
  + Validate the URL
  + JWT\Security?
  + Serverless

## Deploy Notes
gcloud app deploy app.yaml 
gcloud app deploy --no-promote
[Manage Versions](https://console.cloud.google.com/appengine/versions?_ga=2.74684050.-1299799958.1506383456)

# Accessing Live
```
curl https://dwarfstar-2017.appspot.com/
```

