---
title: Threat Detector
symbol: Td
order: 3
summary: Reddit monitoring tool that sends real-time Telegram alerts for chosen keywords.
role: Personal project
stack: [JavaScript, Node.js, Reddit API, Telegram Bot API, Cron]
type: personal
featured: true
---

## The task

I wanted to know as soon as certain topics were mentioned on Reddit — without refreshing pages all day.

## What I did

- Built a Node.js service that scans posts and comments for configurable keywords.
- Sent matches straight to my phone through a Telegram bot.
- Reduced noise with sentiment analysis, exclusion rules and duplicate filtering.
- Split the code into keyword, exclusion and persistence layers so each part can change on its own.
- Ran it continuously with scheduled background jobs.

## What I learned

<!-- TODO: how long it ran, what was hardest, what you would do differently. -->

<!-- Interactive demo (React island) will be embedded here. -->
