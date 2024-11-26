FROM rust:latest
WORKDIR /usr/src/rocket
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY yolov8m.onnx yolov8m.onnx
ENV ROCKET_ADDRESS=0.0.0.0
EXPOSE 8000

# Use shell form for the entrypoint
ENTRYPOINT ["cargo", "run", "--release"]
