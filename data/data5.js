window.HOT100 = window.HOT100 || [];
window.HOT100.push(
{
  lc: 4,
  title: "寻找两个正序数组的中位数",
  cat: "二分查找",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "划分点二分",
  desc: "给定两个正序数组，找出合并后的中位数，要求时间复杂度 O(log(m+n))。",
  idea: "在较短数组上二分一个划分点 i，另一个数组划分点 j=(m+n+1)/2−i，使左半元素个数与右半相等（或多一个）。调整 i 让 max(左) ≤ min(右)，划分正确时按奇偶取中位数。",
  traps: ["在短数组二分才能保证 O(log(min(m,n)))", "用 ±∞ 当哨兵省去越界特判", "half=(m+n+1)/2 兼顾奇偶，奇数时中位数落在左半"],
  comp: "时间 O(log(min(m,n)))，空间 O(1)",
  code: `class Solution {
    public double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a); // 在短数组二分
        int m = a.length, n = b.length, half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;
            int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1];
            int aR = i == m ? Integer.MAX_VALUE : a[i];
            int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1];
            int bR = j == n ? Integer.MAX_VALUE : b[j];
            if (aL <= bR && bL <= aR) {                  // 划分正确
                if (((m + n) & 1) == 1) return Math.max(aL, bL);
                return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
            } else if (aL > bR) hi = i - 1;              // a 左半太大，左移
            else lo = i + 1;                             // a 左半太小，右移
        }
        return 0.0;
    }
}`
},
{
  lc: 23,
  title: "合并 K 个升序链表",
  cat: "链表",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "小顶堆 / 分治",
  desc: "合并 k 个升序链表为一个升序链表并返回。",
  idea: "小顶堆装各链表当前头节点，每次弹出最小接到结果尾，再把它的 next 入堆，直到堆空。时间 O(N log k)。备选：两两归并的分治，复杂度相同。",
  traps: ["入堆前判 null，否则比较器空指针", "弹出节点后要把它的 next 入堆", "k 为链表数、N 为总节点数"],
  comp: "时间 O(N log k)，空间 O(k)",
  code: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((x, y) -> x.val - y.val);
        for (ListNode l : lists) if (l != null) pq.offer(l);   // null 不入堆
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();          // 当前最小
            tail.next = node;
            tail = node;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }
}`
},
{
  lc: 32,
  title: "最长有效括号",
  cat: "动态规划",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "栈记下标",
  desc: "给定只含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。",
  idea: "栈底放 −1 当哨兵（最后一个未匹配位置）。遇 '(' 压下标；遇 ')' 先弹栈，若栈空则把当前下标作新哨兵入栈，否则用 i − 栈顶 更新最长长度。",
  traps: ["栈里存下标而非字符", "初始压 −1 作宽度基准", "弹空后把当前 ) 的下标入栈当新基准"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public int longestValidParentheses(String s) {
        Deque<Integer> stk = new ArrayDeque<>();
        stk.push(-1);                          // 哨兵：最后一个未匹配位置
        int max = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stk.push(i);
            } else {
                stk.pop();                     // 尝试匹配一个 '('
                if (stk.isEmpty()) stk.push(i);             // 无可匹配，i 当新哨兵
                else max = Math.max(max, i - stk.peek());   // 当前有效长度
            }
        }
        return max;
    }
}`
},
{
  lc: 41,
  title: "缺失的第一个正数",
  cat: "普通数组",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "原地哈希",
  desc: "给定未排序整数数组，O(n) 时间、O(1) 额外空间找出没有出现的最小正整数。",
  idea: "萝卜蹲：把值 x（1≤x≤n）交换到下标 x−1 处。再扫一遍找第一个 nums[i]≠i+1 的位置返回 i+1；全部就位则返回 n+1。",
  traps: ["用 while 反复归位，换来的新值可能还要继续放", "交换条件含「目标位已正确」判断，防死循环", "只关心落在 1..n 的数"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            // 把 nums[i] 归位到下标 nums[i]-1，直到当前位放对或越界
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int t = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = t;
            }
        }
        for (int i = 0; i < n; i++)
            if (nums[i] != i + 1) return i + 1;   // 第一个缺失的正数
        return n + 1;                              // 1..n 都在
    }
}`
},
{
  lc: 51,
  title: "N 皇后",
  cat: "回溯",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "回溯+对角线标记",
  desc: "在 n×n 棋盘放 n 个皇后使其互不攻击，返回所有不同的解法。",
  idea: "逐行放皇后，用三个布尔数组标记已占的列、主对角线(row−col)、副对角线(row+col)。放下→递归下一行→撤销，到底收集棋盘。",
  traps: ["主对角线 row−col 加 n 防负下标", "逐行放、行内只放一个，天然不重复", "撤销时三个标记都要复位"],
  comp: "时间 O(n!)，空间 O(n)",
  code: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        boolean[] col = new boolean[n], d1 = new boolean[2 * n], d2 = new boolean[2 * n];
        backtrack(res, board, 0, n, col, d1, d2);
        return res;
    }

    private void backtrack(List<List<String>> res, char[][] b, int r, int n,
                           boolean[] col, boolean[] d1, boolean[] d2) {
        if (r == n) { res.add(build(b)); return; }
        for (int c = 0; c < n; c++) {
            int id1 = r - c + n, id2 = r + c;          // 主/副对角线编号
            if (col[c] || d1[id1] || d2[id2]) continue;
            b[r][c] = 'Q'; col[c] = d1[id1] = d2[id2] = true;
            backtrack(res, b, r + 1, n, col, d1, d2);
            b[r][c] = '.'; col[c] = d1[id1] = d2[id2] = false;   // 撤销
        }
    }

    private List<String> build(char[][] b) {
        List<String> rows = new ArrayList<>();
        for (char[] row : b) rows.add(new String(row));
        return rows;
    }
}`
},
{
  lc: 72,
  title: "编辑距离",
  cat: "多维动态规划",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "二维 DP",
  desc: "求把 word1 转换成 word2 所使用的最少操作数（插入、删除、替换各算一次）。",
  idea: "dp[i][j] = word1 前 i 个变成 word2 前 j 个的最少操作。字符相等取 dp[i−1][j−1]；否则 1 + min(删 dp[i−1][j]、增 dp[i][j−1]、改 dp[i−1][j−1])。边界 dp[i][0]=i、dp[0][j]=j。",
  traps: ["边界 dp[i][0]=i、dp[0][j]=j 表示删光 / 全增", "三种操作分别对应三个相邻状态", "字符下标用 i−1 / j−1 别越界"],
  comp: "时间 O(mn)，空间 O(mn)",
  code: `class Solution {
    public int minDistance(String w1, String w2) {
        int m = w1.length(), n = w2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;   // 删光
        for (int j = 0; j <= n; j++) dp[0][j] = j;   // 全增
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                if (w1.charAt(i - 1) == w2.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1];      // 字符相同，无需操作
                else
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],            // 替换
                                   Math.min(dp[i - 1][j], dp[i][j - 1])); // 删 / 增
            }
        return dp[m][n];
    }
}`
},
{
  lc: 76,
  title: "最小覆盖子串",
  cat: "子串",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "滑动窗口+计数",
  desc: "在字符串 s 中找出涵盖 t 全部字符（含重复）的最小子串，不存在返回空串。",
  idea: "need 数组记 t 中各字符数，required = t 长度。右扩入窗，遇到「有用字符」required−−；当 required==0 表示窗口已覆盖 t，收缩左边界更新最短答案。",
  traps: ["need 可变负，记录窗口多余量", "用 required 计字符总数比按种类计更简洁", "右指针先记录答案再移动 left"],
  comp: "时间 O(|s|+|t|)，空间 O(1)（字符集大小固定）",
  code: `class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int required = t.length();                       // 还需补齐的字符总数
        int left = 0, start = 0, minLen = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right)]-- > 0) required--;  // 是有用字符
            while (required == 0) {                       // 窗口已覆盖 t
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    start = left;
                }
                if (need[s.charAt(left)]++ == 0) required++;  // 移出有用字符
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}`
},
{
  lc: 84,
  title: "柱状图中最大的矩形",
  cat: "栈",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "单调栈",
  desc: "给定柱状图各柱高度（宽均为 1），求能勾勒出的最大矩形面积。",
  idea: "维护下标递增、对应高度递增的单调栈。遇到更矮的柱就弹栈：弹出者作矩形高 h，宽 = 当前下标 − 新栈顶 − 1（左右第一个更矮的之间）。栈底放 −1、末尾补 0 高度简化边界。",
  traps: ["栈底放 −1 哨兵，宽度 = i − 栈顶 − 1", "末尾用高度 0 触发清空栈", "宽度是弹出后新栈顶到 i 的跨度，不是固定 1"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, max = 0;
        Deque<Integer> stk = new ArrayDeque<>();
        stk.push(-1);                              // 左哨兵，作宽度基准
        for (int i = 0; i <= n; i++) {
            int h = i == n ? 0 : heights[i];       // 末尾哨兵 0，清空栈
            while (stk.peek() != -1 && heights[stk.peek()] >= h) {
                int top = stk.pop();
                int width = i - stk.peek() - 1;    // 左右第一个更矮的之间
                max = Math.max(max, heights[top] * width);
            }
            stk.push(i);
        }
        return max;
    }
}`
},
{
  lc: 124,
  title: "二叉树中的最大路径和",
  cat: "二叉树",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "后序树形DP",
  desc: "路径为任意节点序列经父子边相连（不必过根），求所有路径中节点值之和的最大值。",
  idea: "后序递归返回「以该节点为端点向下延伸的最大单边贡献」（负贡献截断为 0）。在每个节点用 node.val + 左贡献 + 右贡献 更新全局答案（可拐弯），向上返回时只能选一边。",
  traps: ["子树负贡献截断为 0", "更新答案用左+右(拐弯)，返回只能取一边", "答案初值用 MIN_VALUE，节点值可能全负"],
  comp: "时间 O(n)，空间 O(h)",
  code: `class Solution {
    private int max = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return max;
    }

    // 返回以 node 为起点向下延伸的最大贡献
    private int gain(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(gain(node.left), 0);    // 负贡献不要
        int right = Math.max(gain(node.right), 0);
        max = Math.max(max, node.val + left + right); // 经过 node 的拐弯路径
        return node.val + Math.max(left, right);      // 向上只能延伸一边
    }
}`
},
{
  lc: 239,
  title: "滑动窗口最大值",
  cat: "子串",
  diff: "困难",
  tier: "A",
  budget: 150,
  pattern: "单调队列",
  desc: "大小为 k 的窗口从左滑到右，每次返回窗口内的最大值，组成结果数组。",
  idea: "双端队列存下标且对应值单调递减。新元素入队前弹掉队尾所有比它小的；队首即窗口最大值；队首下标滑出窗口（≤ i−k）时弹出。",
  traps: ["队列存下标才能判断是否滑出窗口", "队首过期判断 peekFirst() ≤ i−k", "从 i ≥ k−1 起开始记录答案"],
  comp: "时间 O(n)，空间 O(k)",
  code: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();     // 存下标，对应值单调递减
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();  // 队首过期
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];          // 队首即最大
        }
        return res;
    }
}`
},
{
  lc: 295,
  title: "数据流的中位数",
  cat: "堆",
  diff: "困难",
  tier: "A",
  budget: 150,
  pattern: "对顶双堆",
  desc: "设计支持 addNum 添加整数、findMedian 返回当前所有元素中位数的数据结构。",
  idea: "大顶堆 lo 存较小一半，小顶堆 hi 存较大一半，保持 lo 比 hi 多一个或相等。加数先进 lo 再把 lo 顶移到 hi，若 hi 更大则回移一个。中位数：总数为奇取 lo 顶，为偶取两顶平均。",
  traps: ["先入 lo 再倒进 hi，保证 lo 顶 ≤ hi 顶的有序划分", "再平衡让 lo 比 hi 多一个", "偶数取两堆顶平均，注意除以 2.0"],
  comp: "时间 加数 O(log n)、查询 O(1)，空间 O(n)",
  code: `class MedianFinder {
    private PriorityQueue<Integer> lo = new PriorityQueue<>((a, b) -> b - a); // 大顶堆，小的一半
    private PriorityQueue<Integer> hi = new PriorityQueue<>();                // 小顶堆，大的一半

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());                            // 过一遍 lo，保证有序划分
        if (hi.size() > lo.size()) lo.offer(hi.poll()); // 维持 lo 多一个或相等
    }

    public double findMedian() {
        return lo.size() > hi.size() ? lo.peek()
                                     : (lo.peek() + hi.peek()) / 2.0;
    }
}`
}
);
