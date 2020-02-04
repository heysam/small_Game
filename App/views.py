from datetime import datetime

from django.shortcuts import render
import random as r


# Create your views here.
from App.models import Person


def post(request):
    if request.method == "POST":  # 如果以POST
        username = request.POST['username']
        ig = request.POST['IG']
        toSay = request.POST['toSay']
        if request.POST['username'] == "":
            error = "請輸入您的暱稱"
        else:
            mess = "安安～你好～" + request.POST['username']  # 取得表單輸入資料
            global player
            player = request.POST['username']
        global M_num,S_num
        M_num = master_num()
        S_num = slave_num()
        if 'slave' in request.POST:
            mess_slave = player + "的幸運數字為" + str(S_num)
            return render(request, "post.html", locals())
        if 'master' in request.POST:
            mess = game(player, S_num, M_num)
            time= now()
            return render(request, "post.html", locals())
    else:
        mess = ""
    return render(request, "post.html", locals())

    # s = Person(P_name=player, P_ig=ig, P_say=toSay, P_result=mess)
    # s.save()

def slave_num():
    s_num = r.randint(1, 100)
    return s_num


def master_num():
    m_num = r.randint(1, 100)
    return m_num


def game(player="test", S_num=3 ,M_num=4):
    mastername = "Sam"
    if S_num > M_num:
        return "%s %d 贏 %s %d！" % (player, S_num, mastername, M_num)
    else:
        return "%s %d 輸 %s %d！" % (player, S_num, mastername, M_num)
def now():
    now = datetime.now()
    h = str(now.hour)
    if len(h) == 1:
        h = "0" + h
    m = str(now.minute)
    if len(m) == 1:
        m = "0" + m
    s = str(now.second)
    if len(s) == 1:
        s = "0" + s
    now_str = h + ":" + m + ":" + s
    return now_str