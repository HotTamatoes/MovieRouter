FROM golang:bookworm AS builder
WORKDIR /server
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .
FROM debian:bookworm-slim
WORKDIR /server
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /server/server .
CMD ["./server"]