window.HOT100 = window.HOT100 || [];
window.HOT100.push(
{
  lc: 1,
  title: "两数之和",
  cat: "哈希",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "一遍哈希",
  desc: "给定整数数组和目标值，返回和为目标值的两个数的下标（恰有一解）。",
  idea: "边遍历边查表：对每个 x 先查 target-x 是否已在哈希表中，在则返回两下标，否则把 x→下标 存入。",
  traps: ["先查后存，避免把同一个元素用两次"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (map.containsKey(need)) return new int[]{map.get(need), i};
            map.put(nums[i], i); // 先查后存
        }
        return new int[0];
    }
}`
},
{
  lc: 49,
  title: "字母异位词分组",
  cat: "哈希",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "排序作键",
  desc: "把字符串数组中互为字母异位词的字符串分到同一组。",
  idea: "异位词排序后完全相同：把每个词的字符排序后的字符串作为哈希表的 key，同 key 的归一组。",
  traps: ["用 map.computeIfAbsent 简化建组", "追问优化：用 26 维计数数组拼 key，省掉排序的 log"],
  comp: "时间 O(n·k log k)，空间 O(n·k)",
  code: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] cs = s.toCharArray();
            Arrays.sort(cs); // 排序后作为分组 key
            map.computeIfAbsent(new String(cs), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
},
{
  lc: 128,
  title: "最长连续序列",
  cat: "哈希",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "哈希集合找起点",
  desc: "在未排序数组中找出数字连续的最长序列长度，要求 O(n)。",
  idea: "全部入 HashSet；只有当 num-1 不在集合时，num 才是某段连续序列的起点，从起点开始向后逐个 +1 数长度。",
  traps: ["不判起点直接数会退化成 O(n²)", "遍历集合而不是原数组，避免重复元素浪费"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int ans = 0;
        for (int x : set) {
            if (set.contains(x - 1)) continue; // 不是起点就跳过
            int cur = x, len = 1;
            while (set.contains(cur + 1)) { cur++; len++; }
            ans = Math.max(ans, len);
        }
        return ans;
    }
}`
},
{
  lc: 283,
  title: "移动零",
  cat: "双指针",
  diff: "简单",
  tier: "B",
  budget: 60,
  pattern: "快慢指针",
  desc: "原地把数组中所有 0 移到末尾，保持非零元素相对顺序。",
  idea: "慢指针 k 指向下一个非零元素应放的位置；遍历遇到非零就与 k 处交换并 k++。",
  traps: ["i == k 时交换是无害的，不必特判"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public void moveZeroes(int[] nums) {
        int k = 0; // 下一个非零元素应放的位置
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                int t = nums[i]; nums[i] = nums[k]; nums[k] = t;
                k++;
            }
        }
    }
}`
},
{
  lc: 11,
  title: "盛最多水的容器",
  cat: "双指针",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "对撞双指针",
  desc: "选两条垂线与 x 轴构成容器，求能盛的最多水量。",
  idea: "左右指针从两端向内收：面积由较矮一侧决定，移动较矮的指针才可能变大，移动较高的只会更差。",
  traps: ["必须移动较矮一侧，理由要能口述（宽度变小，高度上限不变）"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, ans = 0;
        while (l < r) {
            ans = Math.max(ans, (r - l) * Math.min(height[l], height[r]));
            if (height[l] < height[r]) l++; // 移动较矮一侧
            else r--;
        }
        return ans;
    }
}`
},
{
  lc: 15,
  title: "三数之和",
  cat: "双指针",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "排序+双指针",
  desc: "找出数组中所有和为 0 且不重复的三元组。",
  idea: "排序后固定第一个数 i，剩下用对撞双指针找两数和为 -nums[i]；i、left、right 三处都要跳过重复值去重。",
  traps: ["三处去重缺一不可", "nums[i] > 0 可直接剪枝退出", "命中后 l++ r-- 同时收"],
  comp: "时间 O(n²)，空间 O(log n)（排序栈）",
  code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (nums[i] > 0) break; // 最小数为正，无解
            if (i > 0 && nums[i] == nums[i - 1]) continue; // 去重 1
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else {
                    ans.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++; // 去重 2
                    while (l < r && nums[r] == nums[r - 1]) r--; // 去重 3
                    l++; r--;
                }
            }
        }
        return ans;
    }
}`
},
{
  lc: 42,
  title: "接雨水",
  cat: "双指针",
  diff: "困难",
  tier: "S",
  budget: 240,
  pattern: "双指针+左右最大",
  desc: "给定柱子高度数组，求下雨后能接多少水。",
  idea: "每格接水量 = min(左侧最高, 右侧最高) − 自身高度。双指针维护 leftMax / rightMax，每次结算较矮的一侧：leftMax < rightMax 时左边的水量已被 leftMax 锁定，可直接结算。",
  traps: ["先更新 max 再结算（或结算时用更新后的 max 减自身）", "口述备选：单调栈按层算、或两遍前后缀 max 数组"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int leftMax = 0, rightMax = 0, ans = 0;
        while (l < r) {
            leftMax = Math.max(leftMax, height[l]);
            rightMax = Math.max(rightMax, height[r]);
            if (leftMax < rightMax) {       // 左侧水位由 leftMax 决定，可结算
                ans += leftMax - height[l];
                l++;
            } else {
                ans += rightMax - height[r];
                r--;
            }
        }
        return ans;
    }
}`
},
{
  lc: 3,
  title: "无重复字符的最长子串",
  cat: "滑动窗口",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "滑动窗口",
  desc: "求字符串中不含重复字符的最长子串长度。",
  idea: "窗口 [l, r] 内保持无重复：r 右移把字符加入 Set，若重复则不断从左侧移除并 l++，每步用窗口长度更新答案。",
  traps: ["收缩条件是 while 不是 if", "窗口长度是 r - l + 1"],
  comp: "时间 O(n)，空间 O(字符集)",
  code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> win = new HashSet<>();
        int l = 0, ans = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            while (win.contains(c)) win.remove(s.charAt(l++)); // 收缩到无重复
            win.add(c);
            ans = Math.max(ans, r - l + 1);
        }
        return ans;
    }
}`
},
{
  lc: 438,
  title: "找到字符串中所有字母异位词",
  cat: "滑动窗口",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "定长滑动窗口",
  desc: "在字符串 s 中找出所有 p 的字母异位词子串的起始下标。",
  idea: "维护长度为 p.length 的定长窗口和 26 维词频数组：右端进一个字符、超长时左端出一个字符，每步与 p 的词频数组比较。",
  traps: ["先进后出，窗口长度等于 p.length 时才比较", "Arrays.equals 比较两个计数数组"],
  comp: "时间 O(n·26)，空间 O(26)",
  code: `class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> ans = new ArrayList<>();
        if (s.length() < p.length()) return ans;
        int[] need = new int[26], win = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        int m = p.length();
        for (int r = 0; r < s.length(); r++) {
            win[s.charAt(r) - 'a']++;
            if (r >= m) win[s.charAt(r - m) - 'a']--; // 移出左端
            if (r >= m - 1 && Arrays.equals(win, need)) ans.add(r - m + 1);
        }
        return ans;
    }
}`
},
{
  lc: 560,
  title: "和为 K 的子数组",
  cat: "子串",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "前缀和+哈希计数",
  desc: "统计数组中和恰好为 k 的连续子数组的个数（含负数）。",
  idea: "子数组和 = 前缀和之差：sum[j] − sum[i] = k。遍历时维护 哈希表(前缀和→出现次数)，对当前前缀和 sum 累加 map[sum−k]，再把 sum 计入表。",
  traps: ["必须先 put(0, 1)，处理从下标 0 开始的子数组", "有负数所以不能用滑动窗口"],
  comp: "时间 O(n)，空间 O(n)",
  code: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        cnt.put(0, 1); // 空前缀
        int sum = 0, ans = 0;
        for (int x : nums) {
            sum += x;
            ans += cnt.getOrDefault(sum - k, 0); // 找前面的前缀和
            cnt.merge(sum, 1, Integer::sum);
        }
        return ans;
    }
}`
},
{
  lc: 53,
  title: "最大子数组和",
  cat: "普通数组",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "Kadane",
  desc: "求具有最大和的连续子数组的和。",
  idea: "以 i 结尾的最大和 cur = max(nums[i], cur + nums[i])：前面拖后腿（cur 为负）就抛弃重开，过程中取全局最大。",
  traps: ["答案初始化为 nums[0] 而非 0（全负数组）", "追问分治解法可口述线段树思路"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], ans = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]); // 负担为负就重开
            ans = Math.max(ans, cur);
        }
        return ans;
    }
}`
},
{
  lc: 56,
  title: "合并区间",
  cat: "普通数组",
  diff: "中等",
  tier: "S",
  budget: 240,
  pattern: "排序+合并",
  desc: "合并所有重叠的区间，返回不重叠的区间数组。",
  idea: "按左端点排序后顺序扫描：当前区间左端 ≤ 结果末区间右端则重叠，右端取 max 合并；否则直接追加新区间。",
  traps: ["重叠判断是 cur[0] <= last[1]（相邻贴边也算合并）", "右端要取 max，不能直接覆盖"],
  comp: "时间 O(n log n)，空间 O(n)",
  code: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> ans = new ArrayList<>();
        for (int[] cur : intervals) {
            if (!ans.isEmpty() && cur[0] <= ans.get(ans.size() - 1)[1]) {
                int[] last = ans.get(ans.size() - 1);
                last[1] = Math.max(last[1], cur[1]); // 合并取右端最大
            } else {
                ans.add(cur);
            }
        }
        return ans.toArray(new int[0][]);
    }
}`
},
{
  lc: 189,
  title: "轮转数组",
  cat: "普通数组",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "三次翻转",
  desc: "把数组整体向右轮转 k 个位置，要求原地。",
  idea: "k 先对 n 取模；整体翻转 → 翻转前 k 个 → 翻转后 n−k 个，三次翻转即得结果。",
  traps: ["k %= n 防止越界", "翻转区间端点是闭区间，注意 reverse(0, n-1)、(0, k-1)、(k, n-1)"],
  comp: "时间 O(n)，空间 O(1)",
  code: `class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1); // 整体翻转
        reverse(nums, 0, k - 1); // 前 k 个
        reverse(nums, k, n - 1); // 后 n-k 个
    }

    private void reverse(int[] a, int l, int r) {
        while (l < r) {
            int t = a[l]; a[l] = a[r]; a[r] = t;
            l++; r--;
        }
    }
}`
},
{
  lc: 238,
  title: "除自身以外数组的乘积",
  cat: "普通数组",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "前缀积×后缀积",
  desc: "返回数组 answer，answer[i] 等于除 nums[i] 外所有元素的乘积，不能用除法，O(n)。",
  idea: "answer[i] = 左侧所有数之积 × 右侧所有数之积。先正向把前缀积写入结果数组，再反向用一个变量累乘后缀积乘进去。",
  traps: ["结果数组不计入空间复杂度，所以是 O(1) 额外空间", "后缀积变量在乘入之后再更新"],
  comp: "时间 O(n)，空间 O(1)（输出数组除外）",
  code: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1]; // 前缀积
        int suf = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suf;   // 乘上右侧之积
            suf *= nums[i];
        }
        return ans;
    }
}`
},
{
  lc: 73,
  title: "矩阵置零",
  cat: "矩阵",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "首行首列作标记",
  desc: "矩阵中某元素为 0，则将其所在行和列全部置 0，要求原地。",
  idea: "用第一行、第一列本身存储 \"该行/该列要清零\" 的标记；先用两个布尔记下首行首列原本是否含 0，主体处理完后最后再清首行首列。",
  traps: ["首行首列必须最后清，否则标记被提前破坏", "遍历主体从 (1,1) 开始"],
  comp: "时间 O(mn)，空间 O(1)",
  code: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean row0 = false, col0 = false;
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) row0 = true;
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) col0 = true;
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; } // 打标记
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
        if (row0) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (col0) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
}`
},
{
  lc: 54,
  title: "螺旋矩阵",
  cat: "矩阵",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "四边界收缩",
  desc: "按顺时针螺旋顺序返回矩阵中的所有元素。",
  idea: "维护 top/bottom/left/right 四个边界：依次走上行→右列→下行→左列，每走完一条边向内收缩，注意走下行和左列前判断边界是否仍有效。",
  traps: ["走完上行 top++ 后，走下行前必须再判 top <= bottom（单行/单列矩阵会重复）"],
  comp: "时间 O(mn)，空间 O(1)",
  code: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> ans = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) ans.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) ans.add(matrix[i][right]);
            right--;
            if (top <= bottom)  // 防止单行重复
                for (int j = right; j >= left; j--) ans.add(matrix[bottom][j]);
            bottom--;
            if (left <= right)  // 防止单列重复
                for (int i = bottom; i >= top; i--) ans.add(matrix[i][left]);
            left++;
        }
        return ans;
    }
}`
},
{
  lc: 48,
  title: "旋转图像",
  cat: "矩阵",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "转置+水平翻转",
  desc: "将 n×n 矩阵原地顺时针旋转 90 度。",
  idea: "顺时针 90° = 先沿主对角线转置，再每行水平翻转。两步都是简单交换，远比直接四点轮换好记。",
  traps: ["转置的内层循环从 j = i+1 开始，否则换两次等于没换", "逆时针则是转置后上下翻转"],
  comp: "时间 O(n²)，空间 O(1)",
  code: `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++)          // 主对角线转置
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
            }
        for (int i = 0; i < n; i++)          // 每行水平翻转
            for (int j = 0; j < n / 2; j++) {
                int t = matrix[i][j]; matrix[i][j] = matrix[i][n - 1 - j]; matrix[i][n - 1 - j] = t;
            }
    }
}`
},
{
  lc: 240,
  title: "搜索二维矩阵 II",
  cat: "矩阵",
  diff: "中等",
  tier: "A",
  budget: 150,
  pattern: "右上角排除法",
  desc: "在每行升序、每列升序的矩阵中判断目标值是否存在。",
  idea: "从右上角出发：当前值比 target 大就左移（排除一列），比 target 小就下移（排除一行），像一棵二叉搜索树。",
  traps: ["起点只能是右上或左下，左上/右下两个方向都增大无法排除"],
  comp: "时间 O(m+n)，空间 O(1)",
  code: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int i = 0, j = matrix[0].length - 1; // 右上角
        while (i < matrix.length && j >= 0) {
            if (matrix[i][j] == target) return true;
            if (matrix[i][j] > target) j--; // 排除一列
            else i++;                       // 排除一行
        }
        return false;
    }
}`
}
);
