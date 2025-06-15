FROM golang:bookworm AS builder
WORKDIR /server
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .
FROM golang:bookworm
RUN apt-get update && apt-get install -y \
    chromium \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /server
COPY . .
COPY --from=builder /server/server .
ENV CHROME_PATH=/usr/bin/chromium
CMD ["./server"]