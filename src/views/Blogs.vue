<template>
  <el-main class="blogs" v-loading="loading">
    <div class="blog" v-for="blog in blogs" :key="blog.id">
      <h1 class="title" @click="gotoBlog(blog.number)">{{ blog.title }}</h1>
      <div class="meta">
        <img class="avatar" :src="blog.user.avatar_url">{{ blog.user.login }}, {{ blog.created_at }}, <a target="_blank" :href="blog.html_url">Github Issue #{{ blog.number }}</a>
      </div>

      <div class="labels">
        <el-tag class="label" v-for="label in blog.labels" size="small" :key="label.id" :color="label.color">
          {{ label.name }}
        </el-tag>
      </div>
    </div>
  </el-main>
</template>

<script>
import Blog from '../model/blog'

export default {
  data () {
    return {
      blogs: [],
      loading: true,
      params: {
        state: 'open'
      }
    }
  },
  mounted () {
    Object.assign(this.params, this.$route.query)
    this.getNextPage()
  },
  methods: {
    gotoBlog (number) {
      this.$router.push({
        name: 'blog',
        params: {
          number
        }
      })
    },
    filterLabel (name) {
      this.$router.push({
        name: 'blogs',
        params: {
          labels: name
        }
      })
    },
    getNextPage () {
      this.loading = true

      Blog.list(this.params)
        .then(response => {
          this.blogs = response.data
          this.params.page++
          this.loading = false
        })
    }
  }
}
</script>
