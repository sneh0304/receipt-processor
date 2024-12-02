## Receipt Processor
This package contains solution to [this](https://github.com/fetch-rewards/receipt-processor-challenge/blob/main/README.md) question.

## Steps to run the application
* Run `export imgname=receipt-processor port=4000` or choose any other name for the image and a diff port number.
* Run `docker build -t ${imgname} .`
* Run `docker run -it -e PORT=${port} -p ${port}:${port} ${imgname}`

Now the server is running at port 4000 or the one you chose. You can use postman to POST a request at `http://localhost:4000/receipts/process` and use the response id to get the points using the GET api at `http://localhost:4000/receipts/:id/points`.