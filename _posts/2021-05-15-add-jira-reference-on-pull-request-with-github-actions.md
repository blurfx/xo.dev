---
title: GitHub Actions으로 Pull Request에 JIRA 이슈 뱃지 붙이기
tags: [GitHub, GitHub Actions, Automation, JIRA]
layout: post
comments: true
---

지금 팀에서는 JIRA를 사용하여 이슈를 관리하고, 이슈를 해결하는 작업을 할 때 브랜치 이름을 `ABC-123`과 같이 이슈 ID로 만들어 작업한다.

작업이 끝나면 Pull Request를 통해 코드 리뷰를 하는데, 이 때 이슈와 관련된 정보는 보통 JIRA에 있다. 그래서 어떤 이슈인지 확인하려면 JIRA에 들어가야 하는데 Pull Request가 생기면 JIRA 이슈에 Pull Request를 링크 시키는 것은 이미 되어 있었지만 반대로 Pull Request 본문에 JIRA 링크가 생성되는 기능은 설정되어 있지 않았다.

그래서 해당 기능이 있으면 작업 내용이나 히스토리를 파악하는데 편하겠다 싶어 찾아보니 다른 사람들이 만들어놓은 Action들과 GitHub에 [Autolink references](https://docs.github.com/en/github/administering-a-repository/configuring-autolinks-to-reference-external-resources) 기능이 있었다. 하지만 다른 사람들이 만들어놓은 GitHub Action은 왜인지 잘 작동하지 않았고 Autolink references는, 관리하는 레포지터리가 여러개 있는 상황에서 여러개의 프로젝트 키를 다 설정해주려니 너무 번거로웠다. 그래서 별다른 설정 없이 정말 단순하게 작동하는 GitHub Action을 만들었다.

아래는 맨 처음에 만들었던 브랜치 이름만을 가지고 이슈 링크를 걸어주는 action이다. shields.io를 사용해 Pull Request가 만들어졌을때 본문 맨 위에 ![ABC-123](https://img.shields.io/badge/JIRA-ABC--123-blue)과 같은 뱃지와 함께 JIRA 링크를 걸어준다. 단, 레포지터리 Secrets에 `JIRA_BASE_URL`라는 이름으로 JIRA의 기본 URL을 넣어주어야한다. (e.g. `https://devsisters.atlassian.net`)

```yaml
name: Jira Issue Badger

on:
  pull_request:
    types:
      - opened
jobs:
  prepend-jira-issue-badge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Check branch name
        id: vars
        run: |
          if [[ ${{ github.head_ref }} =~ ^([A-Z]{1}[A-Z0-9]+-[0-9]+)$ ]]; then
            badgeMsg=`echo ${{ github.head_ref }} | sed 's/-/--/'`
            echo ::set-output name=issue::${{ github.head_ref }}
            echo ::set-output name=badge-msg::$badgeMsg
          fi
      - name: Update PR body
        uses: AsasInnab/pr-body-action@v1
        if: steps.vars.outputs.issue != ''
        with:
          body: "[![${{ steps.vars.outputs.issue }}](https://img.shields.io/badge/JIRA-${{ steps.vars.outputs.badge-msg}}-blue)](${{ secrets.JIRA_BASE_URL }}/browse/${{ steps.vars.outputs.issue }})\n${{ github.event.pull_request.body }}"
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

아래는 조금 더 개선한 버전인데 Pull Request 제목에 JIRA issue ID가 들어가는 경우도 고려했다. (e.g.) `ABC-123 lorem ipsum`, `[ABC-123]lorem ipsum`, `(ABC-123) lorem ipsum`

```yml
name: Jira Issue Badger

on:
  pull_request:
    types:
      - opened
jobs:
  prepend-jira-issue-badge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Check branch name
        id: vars
        run: |
          issuePattern="([A-Z]{1}[A-Z0-9]+-[0-9]+)"
          titlePattern="^[[(]?${issuePattern}[])]?.+$"

          if [[ '${{ github.head_ref }}' =~ ^$issuePattern$ ]] || [[ '${{ github.event.pull_request.title }}' =~ $titlePattern ]]; then
            issueId=${BASH_REMATCH[1]}
            badgeMsg=`echo $issueId | sed 's/-/--/'`

            echo ::set-output name=issue::$issueId
            echo ::set-output name=badge-msg::$badgeMsg
          fi
      - name: Update PR body
        uses: AsasInnab/pr-body-action@v1
        if: steps.vars.outputs.issue != ''
        with:
          body: "[![${{ steps.vars.outputs.issue }}](https://img.shields.io/badge/JIRA-${{ steps.vars.outputs.badge-msg}}-blue)](${{ secrets.JIRA_BASE_URL }}/browse/${{ steps.vars.outputs.issue }})\n${{ github.event.pull_request.body }}"
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

