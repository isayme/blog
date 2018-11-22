<template>
  <el-row type="flex">
    <el-col :span="16" :offset="4">
      <el-container id="app">
        <el-header>
          <el-menu mode="horizontal" :router="true">
            <el-menu-item index="/">Home</el-menu-item>
            <el-menu-item index="/blogs">Blogs</el-menu-item>
          </el-menu>
          <router-view></router-view>
        </el-header>
      </el-container>
    </el-col>
  </el-row>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.blogs .blog .title {
  border-bottom: 1px solid #eaecef;
  cursor: pointer;
}

.blog {
  padding-bottom: 1em;
  text-align: left;
}

.blog .title {
  padding: 0.3em;
  margin: 0.3em;
}

.blog h1, h2 {
  text-align: center;
}

.blog .meta {
  text-align: center;
  font-size: 1em;
  margin-bottom: 0.7em;
}

.blog .meta .avatar {
  width: 1.4em;
  height: 1.4em;
  margin-right: 0.4em;
  vertical-align:middle;
}

.blog .labels {
  text-align: center;
}

.blog .labels .label {
  color: white;
  font-weight: 600;
  margin: 0.25em;
}

.blog .body {
  margin-top: 2em;
}

.center {
  text-align: center;
}
</style>
