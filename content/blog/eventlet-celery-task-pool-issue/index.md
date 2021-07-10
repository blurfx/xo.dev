---
title: Celery Task Pool을 Eventlet으로 사용할 때 Database에 접근하지 못하는 문제
date: "2020-03-01"
tags: [Celery, Django]
---

먼저 간단한 Django 앱을 만들어보자.

가장 먼저 할 일은 celery 인스턴스를 만드는 것이다. 프로젝트에서 `celery.py`를 아래와 같이 작성한다.
```python
# celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foo.settings')

celery_app = Celery('foo', broker='redis://127.0.0.1:6379/0')

celery_app.autodiscover_tasks()
```

그다음으로 첫 번째로 Primary Key와 텍스트값을 가지는 모델을 하나 만든다.
```python
# models.py
from django.db import models


class Log(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=255)
```

그다음에는 Celery Task를 정의해준다. 함수 인자로 넘겨받은 문자열을 Log 모델에 저장하는 간단한 Task이다.
```python
# tasks.py
from foo.celery import celery_app
from .models import Log


@celery_app.task
def log_text(text: str):
    Log.objects.create(text=text)
```

마지막으로 HTTP Request를 통해 `log_text` Task를 실행시킬 수 있도록 아래와 같이 View를 작성해준다.
```python
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from app.tasks import log_text


@require_POST
@csrf_exempt
def post_log(request):
    text = request.POST.get('text')
    log_text.delay(text)
    return HttpResponse(status=200)

```

그 뒤, 아래 명령어로 eventlet을 Task Pool로 사용하도록 celery를 실행시키고 Django로 작성한 서버도 실행시킨다.
```sh
celery -A foo worker -P eventlet -c 5
```

이후 View를 통해 `log_text` 함수를 실행시켜본다.
![Screen capture of Postman](./postman.png)

그러면 Celery에서 아래와 같이 `DatabaseWrapper` 객체를 생성한 스레드가 아닌 다른 스레드에서 접근해서 오류가 발생했다고 한다.
```
django.db.utils.DatabaseError: DatabaseWrapper objects created in a thread can only be used in that same thread. The object with alias 'default' was created in thread id 50602264 and this is thread id 73940696.
```

이 문제를 가장 쉽게 해결하는 방법은 Task Pool로 `eventlet`대신 `gevent`를 사용하는 것이다.
```sh
celery -A foo worker -P gevent -c 5
```

`eventlet`을 사용하며 이 문제를 해결하려고 찾아보았으나 `gevent`로 대체하는 방법 외에는 해결 방법을 찾지 못했다.
