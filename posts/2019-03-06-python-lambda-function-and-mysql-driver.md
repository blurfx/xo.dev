---
title: AWS Lambda에서 SQLAlchemy 사용하기
tags: [AWS, Python]
layout: post
comments: true
---

기존에 만들었던 서비스를 다시 새로 개발하며 기존 백엔드 코드를 조금 더 예쁘게 구조화하고 다시 작성할 필요성을 느껴서 어떻게 바꿀까 이리저리 고민을 하다가 데이터베이스에 데이터 삽입과 수정을 하는 로직은 AWS Lambda로, 데이터를 읽기만 하는 부분은 서버에서 RDS 읽기 전용 엔드포인트를 참조하는 방식으로 하기로 했다.

레거시 코드는 Node.js에 ORM없이 Prepared Parameter 정도만 사용하고 있었는데, 전달된 값에 따라 어느 테이블과 값을 참조해야 하는지 분기가 꽤 갈려 Raw Query를 사용하면 코드 가독성도 떨어지고 유지 보수도 더 힘들것 같아 최대한 ORM을 사용하려고 했고, Python ORM 모듈 중 가장 많이 사용하는 `SQLAlchemy`와 `mysql-python` 모듈을 사용하여 코드를 작성했다.

그 후 Lambda에 코드를 업로드 했는데 아래와 같은 오류를 받았다.

```
libmysqlclient.so.20: cannot open shared object file: No such file or directory
```

MySQL 클라이언트 라이브러리가 없다고 한다. Lambda는 그래서 직접 `libmysqlclient.so.20`를 함수 소스 코드에 포함시켜주고 다시 실행 했더니 이번에는 또 아래와 같은 오류를 받았다.

```
/usr/lib/libstdc++.so.6: version `GLIBCXX_3.4.21' not found
```

<br>

대체 뭐가 문제일까 싶어 해결 방법을 찾으려 구글링을 좀 하다가 [이 글](https://forums.aws.amazon.com/thread.jspa?threadID=284016)을 보게 되었다.

결론은 AWS Lambda가 GCC와 표쥰 C++ 라이브러리를 완벽히 지원해주지 않기 때문에 링크 파일(.so)을 직접 패키지에 넣거나 다른 방법을 찾아야 한다는 것..

​많은 데이터베이스 드라이버가 C/C++로 작성되어있기 때문에 이러한 문제가 발생했고 C/C++로 작성되지 않은 드라이버를 사용하면 될 것이라는 결론이 나왔고 Python으로 작성된 MySQL 드라이버인 `PyMySQL`를 사용해서 문제를 해결했다.

### 결론

AWS Lambda에서 SQLAlchemy를 사용하려면 커넥터로 PyMySQL을 사용하면 된다!
