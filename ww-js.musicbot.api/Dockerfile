FROM python:3.9

WORKDIR /usr/src/api

COPY requirements.txt .


RUN apt-get update && apt-get install -y ffmpeg

ENV FFMPEG_BINARY=/usr/bin/ffmpeg

RUN pip install -r requirements.txt

COPY . .

#RUN mv __cache__ /usr/local/lib/python3.9/site-packages/pytubefix
RUN mv bot_guard.py /usr/local/lib/python3.9/site-packages/pytubefix/botGuard

CMD ["gunicorn", "--bind","0.0.0.0:5000", "--timeout","600","main:app"]