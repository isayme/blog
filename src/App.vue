<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="24" :md="14">
      <el-container id="app">
        <el-header>
          <el-menu mode="horizontal" :router="true">
            <el-menu-item index="/">Home</el-menu-item>
            <el-menu-item index="/blogs">Blogs</el-menu-item>
          </el-menu>
        </el-header>
        <router-view></router-view>
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
  padding-left: 0;
  margin: 0.3em;
  margin-left: 0;
}

.blog .meta {
  font-size: 1em;
  margin-bottom: 0.7em;
}

.blog .meta .avatar {
  width: 1.4em;
  height: 1.4em;
  margin-right: 0.4em;
  vertical-align:middle;
}

.blog .labels .label {
  color: white;
  font-weight: 600;
  margin: 0.25em;
}

.blog .body {
  margin-top: 2em;
}
</style>
