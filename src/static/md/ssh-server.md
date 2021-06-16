<h1>Caesar/OpsCloud SSH-Server</h1>

### 帮助文档

##### 添加个人公钥

+ `用户信息`-`个人详情`-`SSH密钥`（编辑-添加公钥）
```
# 查看公钥
$ cat ~/.ssh/id_rsa.pub
```

##### 登录终端
+ mac命令行中输入
```$xslt
# -o StrictHostKeyChecking=no 跳过公钥检查
$ ssh baiyi@oc.xinc818.com
```

```shell
baiyideMacBook-Pro:~ liangjian$ ssh baiyi@127.0.0.1 -p 2222

        _         _        _ _
  _____| |_    __| |_  ___| | |
 (_-<_-< ' \  (_-< ' \/ -_) | |
 /__/__/_||_| /__/_||_\___|_|_| v1.0.0

Please type `help` to see available commands
baiyi 欢迎使用 Caesar SSH Server! 

caesar shell>help
AVAILABLE COMMANDS

Built-In Commands
        clear: Clear the shell screen.
        exit, quit: Exit the shell.
        help: Display help about available commands.
        history: Display or save the history of previously run commands
        script: Read and execute commands from a file.
        stacktrace: Display the full stacktrace of the last error.

Login
        login, open: Login server

Show
        b: Show server before page
        host, list, ls, s, show: Show server
        n: Show server next page


caesar shell>
```