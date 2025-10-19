---
title: "Build-time vs Runtime Environment - Bài học khi môi trường Staging  gọi websocket tới localhost"
date: 2025-10-19T19:32:52+07:00
draft: true
tags: []
categories: []
description: ""
---

# Câu chuyện của tôi

Tuần vừa rồi là lần đầu tiên tôi triển khai một ứng dụng web sử dụng WebSocket lên môi trường Staging. 

Ứng dụng này được phát triển bằng Next.js và sử dụng WebSocket để giao tiếp thời gian thực giữa client và server. Trong quá trình phát triển, tôi đã cấu hình biến môi trường `SOCKET_URL` để chỉ định địa chỉ của server WebSocket.

Trong môi trường Dev, tôi cấu hình biến môi trường `SOCKET_URL` trỏ tới `ws://localhost:8081/socket`, nơi server WebSocket đang chạy cục bộ. Mọi thứ hoạt động trơn tru, tôi có thể kết nối và gửi nhận dữ liệu qua WebSocket mà không gặp vấn đề gì.

Khi tôi đưa ứng dụng lên môi trường Staging, biến môi trường `SOCKET_URL` đã được trỏ tới địa chỉ của server WebSocket thực tế. Tuy nhiên, khi Tester kiểm tra tính năng "Call Socket", màn hình Console lập tức đỏ lòm, Network request báo lỗi:

```
WebSocket connection to 'ws://localhost:8081/socket' failed: Error in connection establishment: net::ERR_CONNECTION_REFUSED
```

Lúc này tôi mới tá hỏa, kiểm tra lại biến môi trường trong configmap, đúng là đã trỏ tới server WebSocket thực tế. Trong code, tôi cũng setup để lấy biến môi trường khi runtime:

```javascript
const socket = process.env.NEXT_PUBLIC_SOCKET_URL;
```

Vậy nguyên nhân là do đâu? Tại trong môi trường Staging, biến môi trường `SOCKET_URL` không được set dù đã có trong configmap. Tại sao trong môi trường Dev mọi thứ lại hoạt động bình thường?

Hàng vạn câu hỏi vì sao hiện lên trong đầu. Và sau một buổi sáng tìm hiểu, tôi đã rút ra được bài học về sự khác biệt giữa Build-time Environment và Runtime Environment trong quá trình phát triển ứng dụng web.

# Runtime Environment và Build-time Environment là gì và tại sao nó quan trọng?

Để hiểu được Runtime Environment và Build-time Environment, đầu tiên ta cần hiểu tại sao lại cần truyền biến môi trường khi triển khai.

Trong quá trình phát triển ứng dụng, chúng ta thường phải làm việc với nhiều môi trường khác nhau như Development, Staging, và Production. Mỗi môi trường này có thể có các cấu hình khác nhau, chẳng hạn như địa chỉ của server, cổng, và các thông tin nhạy cảm khác. Để quản lý những cấu hình này một cách hiệu quả, chúng ta sử dụng biến môi trường.

Biến môi trường cho phép chúng ta tách biệt mã nguồn với các cấu hình cụ thể của từng môi trường. Điều này giúp cho việc triển khai ứng dụng trở nên linh hoạt và dễ dàng hơn. Developer chỉ cần quan tâm đến mã nguồn, trong khi các cấu hình cụ thể sẽ được cung cấp thông qua biến môi trường khi ứng dụng được triển khai.

![How Environment Variables Work](/images/build-time-vs-runtime-environment-bai-hoc-khi-moi-truong-pre-production-goi-websocket-toi-localhost.png)

## Sự khác biệt giữa Build-time Environment và Runtime Environment

### Build-time Environment
Build-time Environment được truyền vào khi ứng dụng được biên dịch và đóng gói. Đây là giá trị ta cần truyền vào khi chạy lệnh build, ví dụ như `docker build --build-arg ENV_VAR=value .`. 

Trong quá trình build, các biến môi trường này sẽ được nhúng trực tiếp vào mã nguồn của ứng dụng. Điều này có nghĩa là *nếu ta thay đổi giá trị của biến môi trường sau khi build, ứng dụng sẽ không nhận biết được sự thay đổi đó*.

### Runtime Environment
Runtime Environment là môi trường mà ứng dụng được chạy sau khi đã được build. Đây là giá trị ta cần truyền vào khi chạy lệnh khởi động ứng dụng, ví dụ như `docker run -e ENV_VAR=value image_name`.

Trong quá trình runtime, ứng dụng sẽ đọc các biến môi trường này để cấu hình hành vi của nó. Điều này cho phép ta thay đổi cấu hình của ứng dụng mà *không cần phải rebuild lại toàn bộ ứng dụng*.

### Tại sao cần phân biệt hai loại môi trường này?

Câu hỏi đặt ra là, tại sao ta không chỉ sử dụng Runtime Environment mà lại cần đến Build-time Environment? Trong khi Runtime Environment cho phép ta thay đổi cấu hình một cách linh hoạt, thì Build-time Environment lại bắt buộc phải truyền khi build, đồng nghĩa với việc ta phải duy trì nhiều bản build cho các môi trường khác nhau và không tận dụng được tính năng tái sử dụng Docker image.

Vấn đề này đặc biệt quan trọng trong các ứng dụng front-end như Next.js, nơi mà mã nguồn được biên dịch thành các tệp tĩnh trước khi được phục vụ. 

Frontend không giống backend.

Backend có thể đọc biến môi trường mỗi lần chạy — đổi env, restart app là xong. Với Frontend thì không.

Khi ta viết React/Vue/Angular, *trình duyệt không thể hiểu JSX, module import hay SCSS*.

Trước khi chạy được, ta cần phải *biên dịch (transpile) và đóng gói (bundle) toàn bộ project thành các file tĩnh* để trình duyệt có thể đọc và thực thi được:

```
index.html
main.[hash].js
vendor.[hash].js
style.[hash].css
...
```

Sau build, app frontend chỉ còn là static file. Không còn Node process nào, không còn process.env thật sự — chỉ là file JS chạy trong trình duyệt.

Khi đó, đoạn code truy cập biến môi trường:

```javascript
fetch(process.env.NEXT_PUBLIC_API_URL + '/data')
```

sẽ được thay thế trực tiếp trong quá trình build thành:

```javascript
fetch("https://api.example.com/data")
```

Nếu ta thay đổi biến môi trường `NEXT_PUBLIC_API_URL` trong Runtime Environment, ứng dụng frontend đã build sẵn sẽ không nhận biết được sự thay đổi này, vì giá trị đã được nhúng trực tiếp vào mã nguồn trong quá trình build. Do đó, để thay đổi cấu hình của ứng dụng frontend, ta cần phải rebuild lại toàn bộ ứng dụng với các biến môi trường mới.

### Nguyên nhân gây lỗi trong trường hợp của tôi

Đến đây chúng ta cũng thấy được, lỗi mà tôi gặp phải trong quá trình triển khai ứng dụng lên môi trường Staging xuất phát từ việc tôi đã sử dụng biến môi trường như một Runtime Environment, trong khi ứng dụng Next.js của tôi lại cần các biến này ở thời điểm Build-time.

```javascript
const socket = process.env.NEXT_PUBLIC_SOCKET_URL; 
```

Trong Nextjs, các biến môi trường bắt đầu bằng `NEXT_PUBLIC_` sẽ được nhúng trực tiếp vào mã nguồn trong quá trình build. Next.js sẽ thay thế `process.env.NEXT_PUBLIC_SOCKET_URL` bằng giá trị cụ thể của biến môi trường tại thời điểm build.

```javascript
const socket = "ws://localhost:8081/socket"; // giá trị được nhúng trong quá trình build
```

Do đó, khi tôi build ứng dụng trong môi trường Dev, biến `NEXT_PUBLIC_SOCKET_URL` được thiết lập là `ws://localhost:8081/socket`, và giá trị này đã được nhúng vào mã nguồn. Khi tôi chạy ứng dụng trong môi trường Staging, mã nguồn vẫn giữ nguyên giá trị này, dẫn đến việc ứng dụng cố gắng kết nối tới `localhost`, nơi không có server WebSocket nào đang chạy.

### Cách khắc phục

Để khắc phục vấn đề này, cách đơn giản nhất là tạo một bản build mới cho môi trường Staging với biến môi trường `NEXT_PUBLIC_SOCKET_URL` được thiết lập đúng giá trị của server WebSocket trong môi trường đó.

Tuy nhiên, cách này không tối ưu vì tôi phải duy trì nhiều bản build cho các môi trường khác nhau. 

Một cách tiếp cận tốt hơn là thêm một file entrypoint.sh để thiết lập biến môi trường đúng cách trước khi khởi động ứng dụng. Ví dụ:

Tôi sẽ build image với env gồm các giá trị mặc định:

```.env
NEXT_PUBLIC_SOCKET_URL=__NEXT_PUBLIC_SOCKET_URL__
```

Sau đó, trong file entrypoint.sh, tôi sẽ thay thế giá trị placeholder `__NEXT_PUBLIC_SOCKET_URL__` bằng giá trị thực tế từ Runtime Environment:

```bash
#!/bin/sh
for file in ./build/static/js/*.js; do
  sed -i "s|__NEXT_PUBLIC_SOCKET_URL__|$NEXT_PUBLIC_SOCKET_URL|g" "$file"
done
exec "$@"
```

Trong Dockerfile, tôi sẽ sử dụng entrypoint.sh này:

```Dockerfile
ARG NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "start"]
```

Với setup này, khi docker run. Tôi sẽ tìm tất cả các file JS đã build, thay thế placeholder bằng giá trị thực tế từ Runtime Environment, và sau đó khởi động ứng dụng. Đảm bảo rằng ứng dụng luôn sử dụng giá trị biến môi trường đúng với môi trường hiện tại mà không cần phải rebuild lại toàn bộ ứng dụng.

# Kết luận
Qua câu chuyện của tôi, hy vọng các bạn đã hiểu rõ hơn về sự khác biệt giữa Build-time Environment và Runtime Environment, cũng như tầm quan trọng của việc quản lý biến môi trường trong quá trình phát triển và triển khai ứng dụng web. Việc nắm vững kiến thức này sẽ giúp bạn tránh được những lỗi không mong muốn và tối ưu hóa quy trình phát triển phần mềm của mình. Chúc các bạn thành công!