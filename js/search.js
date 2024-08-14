// 从站点配置获取基础URL
var baseURL = "{{ .Site.BaseURL }}";

// 获取所有需要被索引的内容
var pages = [
  {{ range .Site.Pages }}
    {
      "uri": "{{ .RelPermalink }}",
      "title": {{ .Title | jsonify }},
      "content": {{ .Plain | jsonify }}  
    },
  {{ end }}
];

// 使用lunr.js构建搜索索引
var idx = lunr(function() {
  this.ref('uri');
  this.field('title');
  this.field('content');

  pages.forEach(function(page) {
    this.add(page);
  }, this);
});

// 搜索函数
function search(query) {
  var results = idx.search(query);
  displayResults(results);
}

// 显示搜索结果
function displayResults(results) {
  var $searchResults = $("#search-results");
  $searchResults.empty(); // 清空之前的结果

  results.forEach(function(result) {
    var page = pages.filter(function(page) {
      return page.uri === baseURL + result.ref;
    })[0];

    $searchResults.append(`
      <li>
        <a href="${baseURL + page.uri}">${page.title}</a>
      </li>
    `);
  });
}

// 搜索输入框事件绑定
$("#search-input").on("input", function() {
  search($(this).val());
});
