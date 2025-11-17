# Gunicorn 설정 파일
import multiprocessing
import os

# 바인딩할 주소와 포트
bind = "0.0.0.0:5000"

# 워커 프로세스 수 (CPU 코어 수 * 2 + 1)
workers = multiprocessing.cpu_count() * 2 + 1

# 워커 클래스 (동기/비동기)
worker_class = "sync"

# 워커 타임아웃 (초)
timeout = 120

# 워커 연결 타임아웃 (초)
keepalive = 2

# 최대 요청 수 (워커 재시작 전)
max_requests = 1000
max_requests_jitter = 50

# 로그 설정
accesslog = "-"  # stdout으로 출력
errorlog = "-"   # stderr로 출력
loglevel = "info"

# 프로세스 이름
proc_name = "instagram-web-service"

# 데몬 모드 (False = 포그라운드 실행)
daemon = False

# 사용자/그룹 (Docker에서는 root)
user = None
group = None

# 임시 디렉토리
tmp_upload_dir = None

# 환경 변수
raw_env = [
    "FLASK_APP=app.py",
    "FLASK_ENV=production"
]

# 프리로드 앱 (메모리 사용량 최적화)
preload_app = True

# 워커 프로세스 시작 시 실행할 함수
def on_starting(server):
    server.log.info("Starting Instagram Web Service Backend")

# 워커 프로세스 시작 시 실행할 함수
def on_reload(server):
    server.log.info("Reloading Instagram Web Service Backend")

# 워커 프로세스 시작 시 실행할 함수
def worker_int(worker):
    worker.log.info("Worker received INT or QUIT signal")

# 워커 프로세스 종료 시 실행할 함수
def pre_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

# 워커 프로세스 시작 시 실행할 함수
def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

# 워커 프로세스 종료 시 실행할 함수
def post_worker_init(worker):
    worker.log.info("Worker initialized (pid: %s)", worker.pid)

# 워커 프로세스 종료 시 실행할 함수
def worker_abort(worker):
    worker.log.info("Worker aborted (pid: %s)", worker.pid)
