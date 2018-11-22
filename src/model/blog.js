import axios from 'axios'
import config from '../config'

function transform (blog) {
  blog.created_at = new Date(blog.created_at).toLocaleDateString() // to locale date
  blog.labels.forEach(label => {
    label.color = '#' + label.color // 格式化颜色
    label.url = '' // 格式化地址
  })
}

export default class Blog {
  static list (params) {
    return axios
      .request({
        baseURL: 'https://api.github.com',
        url: `/repos/${config.username}/${config.repo}/issues`,
        params
      })
      .then(response => {
        let blogs = response.data
        blogs.forEach(transform)

        return response
      })
  }

  static getByNumber (number) {
    return axios
      .request({
        baseURL: 'https://api.github.com',
        url: `/repos/${config.username}/${config.repo}/issues/${number}`
      })
      .then(response => {
        transform(response.data)
        return response
      })
  }
}
