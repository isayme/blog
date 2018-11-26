<template>
  <el-main v-loading="loading" v-if="loading">
  </el-main>
  <el-main class="blog" v-else>
    <h1 class="title">{{ blog.title }}</h1>
    <div class="meta">
      <img class="avatar" :src="blog.user.avatar_url">{{ blog.user.login }}, {{ blog.created_at }}
    </div>

    <div class="labels">
      <el-tag class="label" v-for="label in blog.labels" size="small" :key="label.id" :color="label.color">
        {{ label.name }}
      </el-tag>
    </div>

    <div class="body markdown-body" v-html="renderBody(blog.body)"></div>
  </el-main>
</template>

<script>
import 'github-markdown-css/github-markdown.css'

import marked from 'marked'
import Blog from '../model/blog'

export default {
  data () {
    return {
      loading: true,
      number: 0,
      blog: null
    }
  },
  methods: {
    renderBody (body) {
      return marked(body, { gfm: true, breaks: true, silent: true })
    },
    getBlog (route) {
      this.loading = true

      let { number } = route.params
      Blog.getByNumber(number).then(response => {
        this.blog = response.data
        this.loading = false
      })
    }
  },
  mounted () {
    this.getBlog(this.$route)
  },
  watch: {
    '$route' (to, from) {
      this.getBlog(to)
    }
  }
}
</script>
