window.HOT100 = window.HOT100 || [];
window.HOT100.push(
{
  lc: 200,
  title: "岛屿数量",
  cat: "图论",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "DFS 淹没法",
  desc: "统计 '1'（陆地）'0'（水）网格中岛屿的数量。",
  idea: "遍历网格，遇到 '1' 答案 +1，然后 DFS 把整座岛淹没（全部置 '0'），保证每座岛只数一次。",
  traps: ["直接改原网格当 visited，省空间", "DFS 边界：越界或遇 '0' 直接返回", "追问 BFS / 并查集版本能口述"],
  comp: "时间 O(mn)，空间 O(mn)（递归栈最坏）",
  code: `class Solution {
    public int numIslands(char[][] grid) {
        int ans = 0;
        for (int i = 0; i < grid.length; i++)
            for (int j = 0; j < grid[0].length; j++)
                if (grid[i][j] == '1') {
                    ans++;
                    sink(grid, i, j); // 淹没整座岛
                }
        return ans;
    }

    private void sink(char[][] g, int i, int j) {
        if (i < 0 || i >= g.length || j < 0 || j >= g[0].length || g[i][j] != '1') return;
        g[i][j] = '0';
        sink(g, i + 1, j);
        sink(g, i - 1, j);
        sink(g, i, j + 1);
        sink(g, i, j - 1);
    }
}`
},
{
  lc: 994,
  title: "腐烂的橘子",
  cat: "图论",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "多源 BFS",
  desc: "腐烂橘子每分钟感染四邻的新鲜橘子，求全部腐烂的最少分钟数，不可能则返回 -1。",
  idea: "多源 BFS：所有烂橘子先全部入队作为第 0 层，按层扩散，每扩一层时间 +1；结束后若仍有新鲜橘子返回 -1。",
  traps: ["先统计新鲜橘子数，感染时递减，最后非零返回 -1", "一开始就没有新鲜橘子要返回 0", "时间在扩散出新橘子时才 +1"],
  comp: "时间 O(mn)，空间 O(mn)",
  code: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int fresh = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) queue.offer(new int[]{i, j}); // 多源入队
                else if (grid[i][j] == 1) fresh++;
            }
        int minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!queue.isEmpty() && fresh > 0) {
            minutes++;                      // 按层计时
            int size = queue.size();
            for (int k = 0; k < size; k++) {
                int[] cur = queue.poll();
                for (int[] d : dirs) {
                    int x = cur[0] + d[0], y = cur[1] + d[1];
                    if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == 1) {
                        grid[x][y] = 2;
                        fresh--;
                        queue.offer(new int[]{x, y});
                    }
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
}`
},
{
  lc: 207,
  title: "课程表",
  cat: "图论",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "拓扑排序",
  desc: "给定课程数和先修关系，判断能否修完所有课程（即有向图是否无环）。",
  idea: "BFS 拓扑排序：建邻接表 + 入度数组，入度为 0 的课全部入队；每出队一门课计数并把后继课入度 -1，减到 0 入队。最终计数 == n 则无环。",
  traps: ["prerequisites[i] = [a, b] 表示先修 b 才能修 a，边方向是 b→a", "DFS 三色标记判环是备选"],
  comp: "时间 O(V+E)，空间 O(V+E)",
  code: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]); // b -> a
            indeg[p[0]]++;
        }
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++)
            if (indeg[i] == 0) queue.offer(i);
        int done = 0;
        while (!queue.isEmpty()) {
            int cur = queue.poll();
            done++;
            for (int next : graph.get(cur))
                if (--indeg[next] == 0) queue.offer(next);
        }
        return done == numCourses; // 全部出队说明无环
    }
}`
},
{
  lc: 208,
  title: "实现 Trie (前缀树)",
  cat: "图论",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "26 叉树",
  desc: "实现前缀树的 insert、search（整词）、startsWith（前缀）。",
  idea: "每个节点含 children[26] 和 isEnd 标记。三个操作都是逐字符往下走：insert 没路就开新节点；search 要求走到底且 isEnd；startsWith 只要求走得通。",
  traps: ["search 和 startsWith 区别只在最后是否检查 isEnd，抽出公共的 find"],
  comp: "三操作均时间 O(L)，空间 O(总字符数·26)",
  code: `class Trie {
    private Trie[] children = new Trie[26];
    private boolean isEnd = false;

    public Trie() {}

    public void insert(String word) {
        Trie node = this;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new Trie();
            node = node.children[i];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        Trie node = find(word);
        return node != null && node.isEnd; // 必须是完整单词
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private Trie find(String s) {
        Trie node = this;
        for (char c : s.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}`
},
{
  lc: 46,
  title: "全排列",
  cat: "回溯",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "回溯+used 数组",
  desc: "返回不含重复数字的数组的所有全排列。",
  idea: "回溯：path 记录当前排列，used 标记已用元素；每层遍历所有未用的数，选择→递归→撤销。path 满则收集一份拷贝。",
  traps: ["收集时必须 new ArrayList<>(path) 拷贝", "撤销要同时还原 used 和 path"],
  comp: "时间 O(n·n!)，空间 O(n)",
  code: `class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();
    private boolean[] used;

    public List<List<Integer>> permute(int[] nums) {
        used = new boolean[nums.length];
        backtrack(nums);
        return ans;
    }

    private void backtrack(int[] nums) {
        if (path.size() == nums.length) {
            ans.add(new ArrayList<>(path)); // 拷贝收集
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums);
            path.remove(path.size() - 1);   // 撤销
            used[i] = false;
        }
    }
}`
},
{
  lc: 78,
  title: "子集",
  cat: "回溯",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "回溯收集所有节点",
  desc: "返回不含重复元素数组的所有子集（幂集）。",
  idea: "start 下标回溯：与全排列不同，回溯树上每个节点（包括中间状态）都是一个合法子集，进入递归就收集，再从 start 起逐个尝试加入。",
  traps: ["收集在递归入口处，不设终止条件（start 越界自然停）", "备选：二进制枚举 0 到 2^n−1"],
  comp: "时间 O(n·2^n)，空间 O(n)",
  code: `class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> subsets(int[] nums) {
        backtrack(nums, 0);
        return ans;
    }

    private void backtrack(int[] nums, int start) {
        ans.add(new ArrayList<>(path));   // 每个节点都是答案
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1);
            path.remove(path.size() - 1); // 撤销
        }
    }
}`
},
{
  lc: 17,
  title: "电话号码的字母组合",
  cat: "回溯",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "逐位回溯",
  desc: "返回数字串（2-9）在九宫格键盘上能表示的所有字母组合。",
  idea: "映射表 数字→字母串；按位回溯：第 i 位数字对应的每个字母依次追加到 StringBuilder，递归下一位后删掉。",
  traps: ["空串输入直接返回空列表", "StringBuilder 撤销用 deleteCharAt(length-1)"],
  comp: "时间 O(4^n·n)，空间 O(n)",
  code: `class Solution {
    private static final String[] MAP = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    private List<String> ans = new ArrayList<>();
    private StringBuilder sb = new StringBuilder();

    public List<String> letterCombinations(String digits) {
        if (digits.isEmpty()) return ans;
        backtrack(digits, 0);
        return ans;
    }

    private void backtrack(String digits, int i) {
        if (i == digits.length()) {
            ans.add(sb.toString());
            return;
        }
        for (char c : MAP[digits.charAt(i) - '0'].toCharArray()) {
            sb.append(c);
            backtrack(digits, i + 1);
            sb.deleteCharAt(sb.length() - 1); // 撤销
        }
    }
}`
},
{
  lc: 39,
  title: "组合总和",
  cat: "回溯",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "可重复选的组合回溯",
  desc: "在无重复正整数数组中找出所有和为 target 的组合，同一个数可无限次重复选取。",
  idea: "start 下标回溯保证组合不重复（不回头选前面的数）；允许重复选自身所以递归传 i 而不是 i+1；先排序，候选数超过剩余目标即可 break 剪枝。",
  traps: ["传 i（可重复选自己）不是 i+1", "排序后剪枝才能用 break"],
  comp: "时间指数级，空间 O(target/min)",
  code: `class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates); // 为剪枝排序
        backtrack(candidates, 0, target);
        return ans;
    }

    private void backtrack(int[] c, int start, int remain) {
        if (remain == 0) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < c.length; i++) {
            if (c[i] > remain) break;      // 剪枝
            path.add(c[i]);
            backtrack(c, i, remain - c[i]); // 传 i：可重复选自己
            path.remove(path.size() - 1);
        }
    }
}`
},
{
  lc: 22,
  title: "括号生成",
  cat: "回溯",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "约束回溯",
  desc: "生成 n 对括号的所有有效组合。",
  idea: "带约束的回溯，只生成合法串：左括号数 < n 时可以加 '('；右括号数 < 左括号数 时可以加 ')'。长度到 2n 收集。",
  traps: ["两个约束条件就是合法性的充要条件，不需要事后校验"],
  comp: "时间 O(4^n/√n)（卡特兰数），空间 O(n)",
  code: `class Solution {
    private List<String> ans = new ArrayList<>();
    private StringBuilder sb = new StringBuilder();

    public List<String> generateParenthesis(int n) {
        backtrack(n, 0, 0);
        return ans;
    }

    private void backtrack(int n, int open, int close) {
        if (sb.length() == 2 * n) {
            ans.add(sb.toString());
            return;
        }
        if (open < n) {                    // 还能加左括号
            sb.append('(');
            backtrack(n, open + 1, close);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {                // 右括号不能超过左
            sb.append(')');
            backtrack(n, open, close + 1);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`
},
{
  lc: 79,
  title: "单词搜索",
  cat: "回溯",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "网格 DFS+原地标记",
  desc: "判断单词是否能由网格中相邻（上下左右）且不重复使用的字母连成。",
  idea: "对每个格子尝试作为起点 DFS：当前字符匹配后临时改成 '#' 防止重复使用，四方向递归匹配下一个字符，返回前还原现场。",
  traps: ["回溯还原 board[i][j] 必不可少", "匹配完最后一个字符（k == word.length()-1 时命中）立即返回 true"],
  comp: "时间 O(mn·3^L)，空间 O(L)",
  code: `class Solution {
    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++)
            for (int j = 0; j < board[0].length; j++)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }

    private boolean dfs(char[][] b, String word, int i, int j, int k) {
        if (i < 0 || i >= b.length || j < 0 || j >= b[0].length || b[i][j] != word.charAt(k))
            return false;
        if (k == word.length() - 1) return true;
        char c = b[i][j];
        b[i][j] = '#';                    // 原地标记已访问
        boolean found = dfs(b, word, i + 1, j, k + 1) || dfs(b, word, i - 1, j, k + 1)
                     || dfs(b, word, i, j + 1, k + 1) || dfs(b, word, i, j - 1, k + 1);
        b[i][j] = c;                      // 还原现场
        return found;
    }
}`
},
{
  lc: 131,
  title: "分割回文串",
  cat: "回溯",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "枚举切点回溯",
  desc: "把字符串分割成若干子串，使每个子串都是回文串，返回所有方案。",
  idea: "回溯枚举下一刀的位置：从 start 开始尝试每个结束点 i，子串 s[start..i] 是回文才加入路径并递归处理剩余部分；start 走到串尾收集方案。",
  traps: ["判回文用双指针即可；追问优化再说预处理 DP 表", "收集时拷贝 path"],
  comp: "时间 O(n·2^n)，空间 O(n)",
  code: `class Solution {
    private List<List<String>> ans = new ArrayList<>();
    private List<String> path = new ArrayList<>();

    public List<List<String>> partition(String s) {
        backtrack(s, 0);
        return ans;
    }

    private void backtrack(String s, int start) {
        if (start == s.length()) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < s.length(); i++) {
            if (isPalindrome(s, start, i)) {   // 这一刀合法才继续
                path.add(s.substring(start, i + 1));
                backtrack(s, i + 1);
                path.remove(path.size() - 1);
            }
        }
    }

    private boolean isPalindrome(String s, int l, int r) {
        while (l < r)
            if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}`
},
{
  lc: 35,
  title: "搜索插入位置",
  cat: "二分查找",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "lowerBound",
  desc: "在排序数组中找目标值的下标，不存在则返回应插入的位置。",
  idea: "标准 lowerBound：找第一个 >= target 的位置。闭区间 [l, r] 写法，最终 l 即答案。",
  traps: ["mid 用 l + (r - l) / 2 防溢出", "循环结束 l 恰好是插入点（含末尾）"],
  comp: "时间 O(log n)，空间 O(1)",
  code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] >= target) r = mid - 1; // 收紧右边
            else l = mid + 1;
        }
        return l; // 第一个 >= target 的位置
    }
}`
},
{
  lc: 74,
  title: "搜索二维矩阵",
  cat: "二分查找",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "一维化二分",
  desc: "每行升序且每行首元素大于上一行末元素的矩阵中，判断目标值是否存在。",
  idea: "整个矩阵展平就是一个有序数组：对下标 0 到 m·n−1 二分，idx 映射回 (idx / n, idx % n)。",
  traps: ["与 240 题区分：这题行间也有序，能整体二分到 O(log mn)"],
  comp: "时间 O(log(mn))，空间 O(1)",
  code: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int val = matrix[mid / n][mid % n]; // 一维下标映射
            if (val == target) return true;
            if (val < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
}`
},
{
  lc: 34,
  title: "在排序数组中查找元素的第一个和最后一个位置",
  cat: "二分查找",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "两次 lowerBound",
  desc: "在排序数组中找目标值的起止下标，不存在返回 [-1, -1]，要求 O(log n)。",
  idea: "复用一个 lowerBound（第一个 >= x 的位置）：左边界 = lowerBound(target)；右边界 = lowerBound(target+1) − 1。再校验左边界处确实是 target。",
  traps: ["校验 start 越界或值不等时返回 [-1,-1]", "右边界用 target+1 的技巧避免再写一个 upperBound"],
  comp: "时间 O(log n)，空间 O(1)",
  code: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int start = lowerBound(nums, target);
        if (start == nums.length || nums[start] != target)
            return new int[]{-1, -1};
        int end = lowerBound(nums, target + 1) - 1; // 右界技巧
        return new int[]{start, end};
    }

    private int lowerBound(int[] nums, int target) { // 第一个 >= target
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] >= target) r = mid - 1;
            else l = mid + 1;
        }
        return l;
    }
}`
},
{
  lc: 33,
  title: "搜索旋转排序数组",
  cat: "二分查找",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "旋转数组二分",
  desc: "在旋转过的升序数组（元素互异）中查找目标值下标，要求 O(log n)。",
  idea: "mid 把数组切成两半，必有一半是有序的：用 nums[l] <= nums[mid] 判断左半是否有序，target 在有序那半的范围内就收缩到该半，否则去另一半。",
  traps: ["判有序用 <=（处理 l == mid 的两元素情况）", "范围判断是半开的：左半有序时 nums[l] <= target < nums[mid]"],
  comp: "时间 O(log n)，空间 O(1)",
  code: `class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {           // 左半有序
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {                              // 右半有序
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
}`
},
{
  lc: 153,
  title: "寻找旋转排序数组中的最小值",
  cat: "二分查找",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "与右端比较二分",
  desc: "在旋转过的升序数组（元素互异）中找最小值，要求 O(log n)。",
  idea: "mid 与 nums[r] 比较：nums[mid] > nums[r] 说明最小值在右半（l = mid+1）；否则最小值在左半含 mid（r = mid）。区间收缩到一个点即答案。",
  traps: ["和右端比而不是左端（左端比较无法区分两种形态）", "r = mid 不是 mid-1，mid 可能就是最小值"],
  comp: "时间 O(log n)，空间 O(1)",
  code: `class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1; // 最小值在右半
            else r = mid;                          // mid 可能是答案
        }
        return nums[l];
    }
}`
},
{
  lc: 20,
  title: "有效的括号",
  cat: "栈",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "栈匹配",
  desc: "判断只含六种括号的字符串是否有效闭合。",
  idea: "遇左括号把对应的右括号压栈；遇右括号与栈顶比对，栈空或不匹配即非法；扫完栈必须为空。",
  traps: ["压入对应右括号的写法让比对变成一次 ==", "结尾检查栈空"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
},
{
  lc: 155,
  title: "最小栈",
  cat: "栈",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "辅助最小值栈",
  desc: "设计支持 push、pop、top 和 O(1) 获取最小元素的栈。",
  idea: "辅助栈与主栈同进同出，辅助栈每层存\"截至当前的最小值\"：push 时压 min(新值, 辅助栈顶)，getMin 即辅助栈顶。",
  traps: ["辅助栈为空时直接压新值", "同步 pop，两栈高度始终一致"],
  comp: "所有操作时间 O(1)，空间 O(n)",
  code: `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> mins = new ArrayDeque<>(); // 同步存当前最小

    public MinStack() {}

    public void push(int val) {
        stack.push(val);
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        stack.pop();
        mins.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}`
},
{
  lc: 394,
  title: "字符串解码",
  cat: "栈",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "双栈",
  desc: "解码形如 3[a2[c]] 的字符串为 accaccacc。",
  idea: "数字栈 + 字符串栈：遇数字累积倍数；遇 '[' 把当前倍数和已拼字符串双双压栈、清零重开；遇 ']' 弹出倍数 k 和外层串 prev，当前串重复 k 次接在 prev 后。",
  traps: ["数字可能多位，要 num*10 累积", "']' 时拼接顺序是 prev + cur×k"],
  comp: "时间 O(输出长度)，空间 O(n)",
  code: `class Solution {
    public String decodeString(String s) {
        Deque<Integer> nums = new ArrayDeque<>();
        Deque<StringBuilder> strs = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int num = 0;
        for (char c : s.toCharArray()) {
            if (c >= '0' && c <= '9') {
                num = num * 10 + (c - '0');   // 多位数字
            } else if (c == '[') {
                nums.push(num);
                strs.push(cur);
                num = 0;
                cur = new StringBuilder();    // 重开内层
            } else if (c == ']') {
                int k = nums.pop();
                StringBuilder prev = strs.pop();
                for (int i = 0; i < k; i++) prev.append(cur);
                cur = prev;
            } else {
                cur.append(c);
            }
        }
        return cur.toString();
    }
}`
},
{
  lc: 739,
  title: "每日温度",
  cat: "栈",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "单调栈",
  desc: "对每天温度，求要等多少天才会出现更高温度，等不到为 0。",
  idea: "单调递减栈存下标：新温度比栈顶对应温度高时，不断弹栈结算（等待天数 = 当前下标 − 弹出下标），然后当前下标入栈。",
  traps: ["栈里存下标不是温度，否则算不出天数", "栈内温度严格递减，相等的也压着等"],
  comp: "时间 O(n)（每个下标进出栈各一次），空间 O(n)",
  code: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // 存下标，温度递减
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int j = stack.pop();   // 结算等到更暖的那天
                ans[j] = i - j;
            }
            stack.push(i);
        }
        return ans;
    }
}`
}
);
