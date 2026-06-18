window.HOT100 = window.HOT100 || [];
window.HOT100.push(
{
  lc: 215,
  title: "数组中的第K个最大元素",
  cat: "堆",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "快速选择",
  desc: "找出无序数组中第 k 个最大的元素，要求平均 O(n)。",
  idea: "快速选择：随机选 pivot 分区，比较分区点与目标下标 n−k，只递归命中的那一侧。平均 O(n)。备选：大小为 k 的小顶堆，O(n log k)。",
  traps: ["pivot 必须随机化，否则有序输入退化 O(n²)", "第 k 大 = 升序下标 n−k"],
  comp: "时间平均 O(n)，空间 O(log n)",
  code: `class Solution {
    private Random rand = new Random();

    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, 0, nums.length - 1, nums.length - k);
    }

    private int quickSelect(int[] a, int l, int r, int target) {
        int p = partition(a, l, r);
        if (p == target) return a[p];
        return p < target ? quickSelect(a, p + 1, r, target)
                          : quickSelect(a, l, p - 1, target);
    }

    private int partition(int[] a, int l, int r) {
        int i = l + rand.nextInt(r - l + 1); // 随机 pivot 防退化
        swap(a, i, r);
        int pivot = a[r], p = l;
        for (int j = l; j < r; j++)
            if (a[j] < pivot) swap(a, j, p++);
        swap(a, p, r);
        return p;
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}`
},
{
  lc: 347,
  title: "前 K 个高频元素",
  cat: "堆",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "计数+小顶堆",
  desc: "返回数组中出现频率前 k 高的元素。",
  idea: "HashMap 计数后，用大小为 k 的小顶堆（按频次）筛选：堆未满直接进，否则频次高于堆顶就换掉堆顶。备选：按频次桶排序可到 O(n)。",
  traps: ["小顶堆留下的恰是最大的 k 个，方向别搞反", "堆比较器按 map 的频次比"],
  comp: "时间 O(n log k)，空间 O(n)",
  code: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) cnt.merge(x, 1, Integer::sum);
        PriorityQueue<Integer> heap =                  // 小顶堆按频次
            new PriorityQueue<>((a, b) -> cnt.get(a) - cnt.get(b));
        for (int key : cnt.keySet()) {
            heap.offer(key);
            if (heap.size() > k) heap.poll();          // 挤掉频次最低的
        }
        int[] ans = new int[k];
        for (int i = 0; i < k; i++) ans[i] = heap.poll();
        return ans;
    }
}`
},
{
  lc: 121,
  title: "买卖股票的最佳时机",
  cat: "贪心",
  diff: "简单",
  tier: "A",
  budget: 150,
  pattern: "维护历史最低价",
  desc: "只能买卖一次股票，求最大利润，无利润返回 0。",
  idea: "一次遍历：维护到目前为止的历史最低价 minPrice，每天用 当前价 − minPrice 更新最大利润。",
  traps: ["先更新利润再更新最低价（或用 else if），保证先买后卖", "全程下跌答案是 0 不是负数"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = prices[0], ans = 0;
        for (int p : prices) {
            ans = Math.max(ans, p - minPrice); // 今天卖
            minPrice = Math.min(minPrice, p);  // 历史最低买
        }
        return ans;
    }
}`
},
{
  lc: 55,
  title: "跳跃游戏",
  cat: "贪心",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "维护最远可达",
  desc: "数组元素表示该位置最大跳跃长度，判断能否从首跳到末位。",
  idea: "贪心维护最远可达位置 far：遍历到 i 时若 i > far 说明到不了 i，失败；否则 far = max(far, i + nums[i])，far 覆盖末位即成功。",
  traps: ["i > far 的判断要在更新 far 之前", "far >= n-1 可提前返回 true"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public boolean canJump(int[] nums) {
        int far = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > far) return false;          // 当前点不可达
            far = Math.max(far, i + nums[i]);
            if (far >= nums.length - 1) return true;
        }
        return true;
    }
}`
},
{
  lc: 45,
  title: "跳跃游戏 II",
  cat: "贪心",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "层级贪心",
  desc: "保证可达末位，求跳到末位所需的最少跳跃次数。",
  idea: "像 BFS 分层：end 是当前这一跳能到的边界，遍历中不断更新下一跳最远 far；走到 end 时跳数 +1，end 更新为 far。",
  traps: ["循环到 n-2 即可，到 n-1 再结算会多跳一次", "far 在层内持续更新，跳数只在触达边界时加"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int jump(int[] nums) {
        int jumps = 0, end = 0, far = 0;
        for (int i = 0; i < nums.length - 1; i++) { // 不含最后一格
            far = Math.max(far, i + nums[i]);
            if (i == end) {        // 到达本层边界
                jumps++;
                end = far;
            }
        }
        return jumps;
    }
}`
},
{
  lc: 763,
  title: "划分字母区间",
  cat: "贪心",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "记最后出现位置",
  desc: "把字符串划分为尽量多的片段，使同一字母只出现在一个片段中，返回各片段长度。",
  idea: "先记录每个字母最后出现的位置 last；再遍历，区间右端 end 不断取区间内字母 last 的最大值，i == end 时本段闭合，切一刀。",
  traps: ["end 是动态扩张的，必须取 max", "切段后 start = i + 1"],
  comp: "时间 O(n)，空间 O(26)",
  code: `class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++)
            last[s.charAt(i) - 'a'] = i;       // 每个字母最后出现处
        List<Integer> ans = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {                     // 本段所有字母都不再出现
                ans.add(end - start + 1);
                start = i + 1;
            }
        }
        return ans;
    }
}`
},
{
  lc: 70,
  title: "爬楼梯",
  cat: "动态规划",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "斐波那契滚动",
  desc: "每次可爬 1 或 2 个台阶，求爬到第 n 阶共有多少种方法。",
  idea: "f(n) = f(n-1) + f(n-2)：最后一步要么跨 1 阶要么跨 2 阶。两个变量滚动，无需数组。",
  traps: ["初值 f(1)=1, f(2)=2（或 f(0)=f(1)=1）"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1; // f(0), f(1)
        for (int i = 2; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`
},
{
  lc: 118,
  title: "杨辉三角",
  cat: "动态规划",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "逐行递推",
  desc: "生成杨辉三角的前 numRows 行。",
  idea: "每行首尾为 1，中间 row[j] = 上一行[j-1] + 上一行[j]，逐行生成。",
  traps: ["内层 j 从 1 到 i-1"],
  comp: "时间 O(n²)，空间 O(1)（不计输出）",
  code: `class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) row.add(1);
                else row.add(ans.get(i - 1).get(j - 1) + ans.get(i - 1).get(j));
            }
            ans.add(row);
        }
        return ans;
    }
}`
},
{
  lc: 198,
  title: "打家劫舍",
  cat: "动态规划",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "线性 DP 滚动",
  desc: "不能偷相邻两家，求能偷到的最高金额。",
  idea: "dp[i] = max(dp[i-1] 不偷这家, dp[i-2] + nums[i] 偷这家)。只依赖前两项，两变量滚动。",
  traps: ["状态定义是\"前 i 家的最大值\"而非\"必偷第 i 家\"", "衍生题：环形（打家劫舍 II）拆成两段线性"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0; // dp[i-2], dp[i-1]
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x); // 不偷 / 偷
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`
},
{
  lc: 279,
  title: "完全平方数",
  cat: "动态规划",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "完全背包",
  desc: "求和为 n 的完全平方数的最少数量。",
  idea: "完全背包：dp[i] 表示凑出 i 的最少平方数个数，dp[i] = min(dp[i − j²]) + 1，j² ≤ i。",
  traps: ["dp[0] = 0，其余初始化为大数（i 本身可全用 1 凑，所以最坏是 i）"],
  comp: "时间 O(n√n)，空间 O(n)",
  code: `class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 1; i <= n; i++)
            for (int j = 1; j * j <= i; j++)
                dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
        return dp[n];
    }
}`
},
{
  lc: 322,
  title: "零钱兑换",
  cat: "动态规划",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "完全背包求最少",
  desc: "用给定面额硬币（无限量）凑出总金额的最少硬币数，凑不出返回 -1。",
  idea: "完全背包：dp[i] 表示凑出金额 i 的最少硬币数，dp[i] = min(dp[i − coin]) + 1；dp 初始化为 amount+1 代表不可达，最后判断是否仍为初值。",
  traps: ["初始值用 amount+1 而非 MAX_VALUE，避免 +1 溢出", "dp[0] = 0", "与 518 零钱兑换 II（方案数）区分"],
  comp: "时间 O(amount·硬币数)，空间 O(amount)",
  code: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // 视为无穷
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)
            for (int coin : coins)
                if (coin <= i)
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
},
{
  lc: 139,
  title: "单词拆分",
  cat: "动态规划",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "前缀可拆 DP",
  desc: "判断字符串能否被拆分为字典中单词的拼接（单词可重复使用）。",
  idea: "dp[i] 表示前 i 个字符可被拆分：枚举最后一个单词的起点 j，dp[j] 为真且 s[j..i) 在字典中则 dp[i] 为真。",
  traps: ["dp[0] = true（空串）", "字典先转 HashSet，substring 是 [j, i)"],
  comp: "时间 O(n²)，空间 O(n)",
  code: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true; // 空串可拆
        for (int i = 1; i <= n; i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
        return dp[n];
    }
}`
},
{
  lc: 300,
  title: "最长递增子序列",
  cat: "动态规划",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "贪心+二分 (patience)",
  desc: "求数组中最长严格递增子序列的长度。",
  idea: "tails[len] 存\"长度为 len+1 的递增子序列的最小结尾\"，它天然有序：每个新数二分找第一个 >= 它的位置替换（让结尾更小更有潜力），找不到就追加。tails 长度即答案。",
  traps: ["tails 不是 LIS 本身，只是各长度的最小结尾", "严格递增所以二分找 >=（lowerBound）来替换", "口述备选：O(n²) dp[i] = max(dp[j])+1, nums[j] < nums[i]"],
  comp: "时间 O(n log n)，空间 O(n)",
  code: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int len = 0;
        for (int x : nums) {
            int l = 0, r = len - 1;
            while (l <= r) {            // lowerBound: 第一个 >= x
                int mid = l + (r - l) / 2;
                if (tails[mid] >= x) r = mid - 1;
                else l = mid + 1;
            }
            tails[l] = x;               // 替换或追加
            if (l == len) len++;
        }
        return len;
    }
}`
},
{
  lc: 152,
  title: "乘积最大子数组",
  cat: "动态规划",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "双状态 max/min",
  desc: "求乘积最大的非空连续子数组的乘积。",
  idea: "负数会让最大变最小、最小变最大：同时维护以 i 结尾的最大积 maxP 和最小积 minP，遇负数先交换两者，再各自与 nums[i] 取舍。",
  traps: ["遇负数交换 maxP/minP 是核心", "每步都要和 nums[i] 本身比较（重开）"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int maxProduct(int[] nums) {
        int maxP = nums[0], minP = nums[0], ans = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            if (x < 0) {            // 负数翻转大小
                int t = maxP; maxP = minP; minP = t;
            }
            maxP = Math.max(x, maxP * x);
            minP = Math.min(x, minP * x);
            ans = Math.max(ans, maxP);
        }
        return ans;
    }
}`
},
{
  lc: 416,
  title: "分割等和子集",
  cat: "动态规划",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "0-1 背包",
  desc: "判断数组能否分成两个和相等的子集。",
  idea: "转化为 0-1 背包：能否选出一些数恰好凑出 sum/2。布尔 dp，外层遍历物品、内层容量从大到小倒序（保证每个数只用一次）。",
  traps: ["sum 为奇数直接 false", "内层必须倒序，正序会变成完全背包", "dp[0] = true"],
  comp: "时间 O(n·sum/2)，空间 O(sum/2)",
  code: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 != 0) return false;  // 奇数和不可分
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums)
            for (int j = target; j >= x; j--) // 倒序保证只用一次
                dp[j] = dp[j] || dp[j - x];
        return dp[target];
    }
}`
},
{
  lc: 62,
  title: "不同路径",
  cat: "多维动态规划",
  diff: "中等",
  tier: "B",
  budget: 60,
  pattern: "网格 DP 一维滚动",
  desc: "机器人从 m×n 网格左上角只能向右或向下走，求到右下角的路径数。",
  idea: "dp[i][j] = dp[i-1][j] + dp[i][j-1]；压成一维：dp[j] += dp[j-1]（dp[j] 是上方旧值，dp[j-1] 是左方新值）。",
  traps: ["一维初始化全 1（第一行）", "口述备选：组合数 C(m+n-2, m-1)"],
  comp: "时间 O(mn)，空间 O(n)",
  code: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);            // 第一行
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j - 1];    // 上方 + 左方
        return dp[n - 1];
    }
}`
},
{
  lc: 64,
  title: "最小路径和",
  cat: "多维动态规划",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "网格 DP 原地",
  desc: "从网格左上角到右下角（只能右/下走），求路径上数字总和的最小值。",
  idea: "原地 DP：grid[i][j] += min(上方, 左方)；首行只能来自左、首列只能来自上，单独处理。",
  traps: ["首行首列的边界单独累加", "面试时先问能否改原数组"],
  comp: "时间 O(mn)，空间 O(1)",
  code: `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) continue;
                else if (i == 0) grid[i][j] += grid[i][j - 1];      // 首行
                else if (j == 0) grid[i][j] += grid[i - 1][j];      // 首列
                else grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
            }
        return grid[m - 1][n - 1];
    }
}`
},
{
  lc: 5,
  title: "最长回文子串",
  cat: "多维动态规划",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "中心扩展",
  desc: "求字符串中最长的回文子串。",
  idea: "枚举回文中心向两边扩展：每个位置做两次——以 i 为中心（奇数长）和以 i、i+1 之间为中心（偶数长），记录最长区间。",
  traps: ["奇偶两种中心都要枚举", "扩展函数返回时 l、r 已各多走一步，长度是 r - l - 1", "口述备选：dp[i][j] 区间 DP，或 Manacher O(n)"],
  comp: "时间 O(n²)，空间 O(1)",
  code: `class Solution {
    private int start = 0, maxLen = 1;

    public String longestPalindrome(String s) {
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);       // 奇数长度中心
            expand(s, i, i + 1);   // 偶数长度中心
        }
        return s.substring(start, start + maxLen);
    }

    private void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--; r++;
        }
        int len = r - l - 1;       // 回缩一步后的长度
        if (len > maxLen) {
            maxLen = len;
            start = l + 1;
        }
    }
}`
},
{
  lc: 1143,
  title: "最长公共子序列",
  cat: "多维动态规划",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "二维 LCS",
  desc: "求两个字符串的最长公共子序列长度（可不连续）。",
  idea: "dp[i][j] 表示 text1 前 i 个与 text2 前 j 个的 LCS：末字符相等取左上 +1，否则取 max(上, 左)。",
  traps: ["下标偏移：dp 是 (n+1)×(m+1)，比较的是 charAt(i-1)", "与最长公共子串（必须连续）区分"],
  comp: "时间 O(mn)，空间 O(mn)",
  code: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1] + 1; // 末字符配对
                else
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        return dp[m][n];
    }
}`
},
{
  lc: 136,
  title: "只出现一次的数字",
  cat: "技巧",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "异或",
  desc: "数组中除一个元素只出现一次外其余都出现两次，找出它，要求 O(n) 时间 O(1) 空间。",
  idea: "全员异或：相同的数成对抵消（x^x=0），剩下的就是只出现一次的那个。",
  traps: ["异或满足交换律结合律，顺序无关"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int singleNumber(int[] nums) {
        int ans = 0;
        for (int x : nums) ans ^= x; // 成对抵消
        return ans;
    }
}`
},
{
  lc: 169,
  title: "多数元素",
  cat: "技巧",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "摩尔投票",
  desc: "找出数组中出现次数超过一半的元素（保证存在）。",
  idea: "摩尔投票：维护候选人和票数，遇相同 +1、不同 -1，票数归零换候选人。多数元素的票抵消不完，最后的候选人即答案。",
  traps: ["若不保证存在多数元素，需二次遍历验证"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0], count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x; // 换候选人
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;
    }
}`
},
{
  lc: 75,
  title: "颜色分类",
  cat: "技巧",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "荷兰国旗三指针",
  desc: "原地把只含 0、1、2 的数组排成 0、1、2 的顺序，一趟扫描。",
  idea: "三指针：p0 是 0 区右边界、p2 是 2 区左边界、i 扫描。遇 0 与 p0 换并双双右移；遇 2 与 p2 换、p2 左移但 i 不动（换来的数还没看）；遇 1 直接 i++。",
  traps: ["与 p2 交换后 i 不能前进，换来的可能还是 2", "循环条件 i <= p2"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public void sortColors(int[] nums) {
        int p0 = 0, i = 0, p2 = nums.length - 1;
        while (i <= p2) {
            if (nums[i] == 0) {
                swap(nums, i, p0);
                p0++; i++;
            } else if (nums[i] == 2) {
                swap(nums, i, p2);
                p2--;          // i 不动，换来的还没检查
            } else {
                i++;
            }
        }
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}`
},
{
  lc: 31,
  title: "下一个排列",
  cat: "技巧",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "两找一反转",
  desc: "原地把数组改为字典序的下一个排列，已是最大则改为最小（升序）。",
  idea: "三步：① 从右找第一个升序对 nums[i] < nums[i+1]；② 再从右找第一个大于 nums[i] 的数与之交换；③ 反转 i 之后的整个后缀（此时必为降序，反转成升序最小）。找不到 i 则整个反转。",
  traps: ["第②步从右找的一定在降序后缀里，交换后后缀仍降序", "i 不存在（整体降序）时跳过交换直接全反转"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public void nextPermutation(int[] nums) {
        int n = nums.length;
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--; // ① 第一个升序对
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;            // ② 右起第一个更大数
            int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
        }
        int l = i + 1, r = n - 1;                      // ③ 反转后缀
        while (l < r) {
            int t = nums[l]; nums[l] = nums[r]; nums[r] = t;
            l++; r--;
        }
    }
}`
},
{
  lc: 287,
  title: "寻找重复数",
  cat: "技巧",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "Floyd 判圈",
  desc: "长度 n+1、值域 [1,n] 的数组中只有一个重复数，找出它；不能修改数组，O(1) 空间。",
  idea: "把 i → nums[i] 看作链表的 next 指针：重复数意味着两个下标指向同一节点，即链表有环，环入口就是重复数。套环形链表 II 的快慢指针。",
  traps: ["从下标 0 出发（0 不在值域内，保证 0 不在环上）", "第二阶段一个指针回 0 同速走"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0], fast = nums[nums[0]];
        while (slow != fast) {          // 第一次相遇
            slow = nums[slow];
            fast = nums[nums[fast]];
        }
        slow = 0;                        // 回起点同速走
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;                     // 入环口即重复数
    }
}`
}
);
