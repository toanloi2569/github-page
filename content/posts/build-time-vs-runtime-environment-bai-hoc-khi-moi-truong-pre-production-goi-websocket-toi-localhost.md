---
title: "Build-time vs Runtime Environment - Bài học khi môi trường Staging  gọi websocket tới localhost"
date: 2025-10-19T19:32:52+07:00
draft: true
tags: []
categories: []
description: ""
---

# Build-time vs Runtime Environment - Bài học khi môi trường Staging gọi websocket tới localhost  

Tuần vừa rồi là lần đầu tiên tôi triển khai một ứng dụng web sử dụng WebSocket lên môi trường Staging. Tất cả các feature đều đã hoạt động tốt trong môi trường Dev, chỉ cần cấu hình lại environment, sync argocd, test qua loa là cả nhóm nhận gold đi ăn nhậu.   

Nhưng đời không như là mơ. Tester nhấn nhẹ vào nút "Call Socket", màn hình Console lập tức đỏ lòm, Network request báo:

```
WebSocket connection to 'ws://localhost:8081/socket' failed: Error in connection establishment: net::ERR_CONNECTION_REFUSED
```

Lúc này tôi mới tá hỏa, kiểm tra lại trong configmap thì vẫn là địa chỉ Production. Kiểm tra trong source code thì thấy: 

```javascript
const socket = process.env.NEXT_PUBLIC_SOCKET_URL;
```

Quá chuẩn! Vậy nguyên nhân là do đâu? Tại trong môi trường Staging, biến môi trường `SOCKET_URL` không được set dù đã có trong configmap. Tại sao trong môi trường Dev mọi thứ lại hoạt động bình thường?

Hàng vạn câu hỏi vì sao hiện lên trong đầu. Và sau một buổi sáng tìm hiểu, tôi đã rút ra được bài học về sự khác biệt giữa Build-time Environment và Runtime Environment trong quá trình phát triển ứng dụng web.
