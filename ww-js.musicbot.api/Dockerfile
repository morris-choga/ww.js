FROM python:3.9

WORKDIR /usr/src/api

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN mv cipher.py /usr/local/lib/python3.9/site-packages/pytube

CMD ["gunicorn", "--bind","0.0.0.0:5000", "--timeout","240","main:app"]