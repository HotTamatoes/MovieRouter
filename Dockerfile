FROM golang:bookworm
WORKDIR /server
COPY ./backend/go.mod ./backend/go.sum ./
RUN go mod download
COPY ./backend/ .
RUN go build -o server .
FROM debian:bookworm-slim
WORKDIR /server
COPY --from=builder /server/server .
CMD ["./server"]