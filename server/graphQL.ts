export function discussionGql(discussionCategogyId: string | undefined) {
    return `{
        repository(name: "dev-blog", owner: "minhtien9") {
            id
            discussions(first: 100, categoryId: "${discussionCategogyId}") {
              nodes {
                bodyHTML
                title
                number
                url
                bodyText
                createdAt
                lastEditedAt
                author {
                  login
                  url
                  avatarUrl
                }
                labels(first: 100) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
    }`;
}

// single post
export function discussionDetailGql(postId: number | undefined) {
    return `{
        repository(name: "dev-blog", owner: "minhtien9") {
            discussion(number: ${postId}) {
                title
                bodyHTML
                createdAt
                author {
                    login
                    url
                    avatarUrl
                }
            }
        }
    }`;
}
