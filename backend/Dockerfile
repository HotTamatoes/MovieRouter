FROM golang:bookworm AS builder
WORKDIR /server
COPY ./go.mod ./backend/go.sum ./
RUN go mod download
COPY ./ .
RUN go build -o server .
FROM debian:bookworm-slim
WORKDIR /server
COPY --from=builder /server/server .
CMD ["./server"]