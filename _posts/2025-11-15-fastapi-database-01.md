---
layout: single
title: "[FastAPI] FastAPI에서 비동기로 데이터베이스 연결하기"
categories: Fastapi
tags: [fastapi, database]
toc: true
---

## fastAPI에서 비동기로 데이터베이스 연결하기

### engine 생성

```py
DATABASE_CONN = os.getenv("DATABASE_CONN")
```

- 환경 변수불러오기

```python
engine: AsyncEngine = create_async_engine(DATABASE_CONN, #echo=True,
                       #poolclass=NullPool, # Connection Pool 사용하지 않음. 
                       pool_size=5, max_overflow=0,
                       pool_recycle=300)

```

- echo=True
  - sql쿼리를 콘솔에 출력
- poolclass=NullPool 
  - 커넥션 풀을 생성하지 않음
- pool_size=5, max_overflow=0
  - 풀 갯수, 추가 풀 갯수
- pool_recycle=300
  - 300초 지나면 새로 연결 (풀이 죽은 경우를 대비하여)

### connection pool이 필요한 이유

연결과정  
`서버 - db서버에 tcp 연결 - 연결 성공`  

- 해당 과정들을 매번 반복하기엔 자원 소모가 큼
- 따라서 db와 빠르게 소통하기 위해선 풀을 많이 만들어놓고 필요할때마다 이를 할당해서 씀

### 비동기 엔진으로 사용하는 이유

- 비동기 엔진은 이벤트 루프 기반으로 DB i/o를 기다리는 동안 다른 요청 처리 가능
- 따라서 더 적은 풀로도 운영 가능

---

### connection pool 사용 함수

```python

async def context_get_conn():
    conn = None
    try:
        conn = await engine.connect()
        yield conn
    except SQLAlchemyError as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="요청하신 처리에 문제가 발생하였습니다.")
    finally:
        if conn:
            await conn.close()
```

- conn에  db 연결 객체가 들어감
- yield로 conn을 반환하지만 함수를 종료하지 않음
- finally로 엔드포인트 함수가 완전히 실행을 끝낸 직후에 실행, 만약 conn이 있다면 연결 객체를 닫음
