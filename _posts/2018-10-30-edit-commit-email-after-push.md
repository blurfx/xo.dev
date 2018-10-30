---
layout: post
title: "git commit/push 후 수정하고 다시 커밋하기"
date: 2018-10-30
categories: Git
comments: true
share: true
---

커밋 후 commit message를 다시 수정한다거나, 혹은 그 커밋을 아예 삭제하고 싶다거나(일반적으로 이 경우는 `git revert`로 해당 변경 사항을 취소할 수 있다) 혹은 새로운 환경에서 설정한 git 설정이 잘못 되어 이메일이나 이름이 잘못 되었을때, `git rebase`를 사용하면 된다.

단, 만약 변경하고자 하는 커밋의 해쉬가 bbbbbbb라면 bbbbbbb 이전 커밋의 해쉬로 rebase해야한다. 

예를들어, 나의 경우에는 커밋 87536f6를 변경하고 싶으니 87536f6 직전의 커밋인 e7c4d39로 돌아가야한다. 아래 명령어를 사용하면 된다.

```bash
$ git rebase -i e7c4d39
````

만약 맨 처음 커밋을 수정하고 싶다면 commit hash 대신 --root 파라미터를 넘겨주면 된다.

```bash
$ git rebase -i --root
````

rebase를 하면 아래와 같이 나올것이다.

```bash
pick 7d2f99c my hands are typing
pick cee4d7d fix something
pick e39ef62 fix typo
pick 87536f6 introduce new feature

# Rebase e7c4d39..87536f6 onto e7c4d39 (7 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# 생략
```

여기서 `<command> <hash> <commit message>`구조로 이루어진 커밋 목록에서 `<command>`를 수정하고 저장 한 뒤 원하는 작업을 하면 된다.

주로 사용하는 작업들은 아래와 같다.

- `pick` - 기본 설정으로 이 커밋은 수정하지 않고 무시한다
- `reword` - 커밋 메시지를 수정한다. 위 화면에서 커밋 메시지를 바로 수정하지 않고 저장하면 커밋 메시지 수정 프로세스가 진행된다
- `edit` - amend 모드로 들어간다. 주로 author, email를 수정할 때 사용한다
- `drop` - 해당 커밋을 삭제한다

위 파일을 수정하고 저장하면 이제 아래에서 위로 수정이 필요한 커밋들만 순회하게 된다.

예를들어 만약 아래처럼 변경했다면 `87536f6 - e39ef62 - cee4d7d` 커밋 순서대로 수정하게 된다. `7def99c` 커밋은 `pick`이므로 무시한다

```bash
pick 7d2f99c my hands are typing
edit cee4d7d fix something
reword e39ef62 fix typo
edit 87536f6 introduce new feature
```

이제 원하는 것을 하면 된다.
`edit`의 경우는 `git commit --amend --author="Author Name <new@email.com>`를 하고, `reword`의 경우에는 `git rebase -i <hash>`를 했을때와 같이 새 파일이 열리며 커밋 메시지를 수정할 수 있게 해준다. 
작업이 끝났다면 `git rebase --continue`로 다음 수정할 커밋으로 넘어간다.

모든 작업이 끝났다면 `git push --force`로 변경 사항을 저장하면 된다.