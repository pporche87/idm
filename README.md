# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

1. Setup and run [mehserve][mehserve]. Then figure out which port you intend to use and create the mehserve config file:

        $ echo 9001 > ~/.mehserve/idm.learnersguild

1. Set your `NODE_ENV` environment variable:

        $ export NODE_ENV=development

1. [Install RethinkDB][install-rethinkdb].

1. Install [Redis][redis]

        # With Homebrew on a mac:

        $ brew install redis

1. Obtain your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (see below) by register a new [GitHub OAuth application][github-register-application] for _your_ development environment:
    - Application name: Learners Guild IDM (dev)
    - Homepage URL: http://idm.learnersguild.dev
    - Authorization callback URL: http://idm.learnersguild.dev/auth/github/callback

1. Generate a key-pair for JWT token signing / verifying:

        $ openssl genrsa -out /tmp/private-key.pem 2048
        $ openssl rsa -in /tmp/private-key.pem -outform PEM -pubout -out /tmp/public-key.pem

1. Create and edit your `.env` file for your environment. Copy `.env.example`:

        $ cp .env.example .env
        $ $EDITOR .env

1. Add your public and private keys to `.env`:

        JWT_PRIVATE_KEY="<quoted string data from /tmp/private-key.pem with \n for newlines>"
        JWT_PUBLIC_KEY="<quoted string data from /tmp/public-key.pem with \n for newlines>"

1. Setup npm auth

1. Create an [npmjs.org](https://www.npmjs.com/) account if you don't have one.

1. Login from the command line

        $ npm login

1. Get your npm auth token from your `~/.npmrc`

        $ cat ~/.npmrc
        //registry.npmjs.org/:_authToken=<YOUR NPM AUTH TOKEN>

1.  Set `NPM_AUTH_TOKEN` in your shell.

        # in ~/.bashrc (or ~/.zshrc, etc)
        export NPM_AUTH_TOKEN=<YOUR NPM AUTH TOKEN>

1. Run the setup tasks:

        $ npm install
        $ npm run db:create
        $ npm run db:migrate -- up

1. (OPTIONAL) Generate some test data. Most likely needed for co-developing the [game][game] service:

        $ npm run dev:testdata

1. Run the server:

        $ npm start

1. Visit the server in your browser:

        $ open http://idm.learnersguild.dev

## License

See the [LICENSE](./LICENSE) file.

[game]: https://github.com/LearnersGuild/game
[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
[redis]: http://redis.io/
[mehserve]: https://github.com/timecounts/mehserve
