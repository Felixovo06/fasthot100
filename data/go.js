/* Go 解法：保持 LeetCode 函数签名，优先选面试时容易讲清和手写的实现。 */
window.HOT100_GO = {
  1: `func twoSum(nums []int, target int) []int {
	seen := make(map[int]int)
	for i, x := range nums {
		if j, ok := seen[target-x]; ok {
			return []int{j, i}
		}
		seen[x] = i
	}
	return []int{}
}`,
  2: `func addTwoNumbers(l1, l2 *ListNode) *ListNode {
	dummy := &ListNode{}
	tail, carry := dummy, 0
	for l1 != nil || l2 != nil || carry > 0 {
		sum := carry
		if l1 != nil {
			sum += l1.Val
			l1 = l1.Next
		}
		if l2 != nil {
			sum += l2.Val
			l2 = l2.Next
		}
		tail.Next = &ListNode{Val: sum % 10}
		tail = tail.Next
		carry = sum / 10
	}
	return dummy.Next
}`,
  3: `func lengthOfLongestSubstring(s string) int {
	last := make(map[byte]int)
	left, best := 0, 0
	for right := 0; right < len(s); right++ {
		if at, ok := last[s[right]]; ok && at >= left {
			left = at + 1
		}
		last[s[right]] = right
		if right-left+1 > best {
			best = right - left + 1
		}
	}
	return best
}`,
  4: `import "math"

func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	if len(nums1) > len(nums2) {
		return findMedianSortedArrays(nums2, nums1)
	}
	m, n := len(nums1), len(nums2)
	left, right := 0, m
	for left <= right {
		cut1 := left + (right-left)/2
		cut2 := (m+n+1)/2 - cut1
		// 哨兵让切分点落在数组两端时也能直接比较。
		left1, right1 := math.MinInt, math.MaxInt
		left2, right2 := math.MinInt, math.MaxInt
		if cut1 > 0 {
			left1 = nums1[cut1-1]
		}
		if cut1 < m {
			right1 = nums1[cut1]
		}
		if cut2 > 0 {
			left2 = nums2[cut2-1]
		}
		if cut2 < n {
			right2 = nums2[cut2]
		}
		if left1 <= right2 && left2 <= right1 {
			if (m+n)%2 == 1 {
				if left1 > left2 {
					return float64(left1)
				}
				return float64(left2)
			}
			maxLeft := left1
			if left2 > maxLeft {
				maxLeft = left2
			}
			minRight := right1
			if right2 < minRight {
				minRight = right2
			}
			return (float64(maxLeft) + float64(minRight)) / 2
		}
		if left1 > right2 {
			right = cut1 - 1
		} else {
			left = cut1 + 1
		}
	}
	return 0
}`,
  5: `func longestPalindrome(s string) string {
	if len(s) < 2 {
		return s
	}
	expand := func(left, right int) (int, int) {
		for left >= 0 && right < len(s) && s[left] == s[right] {
			left--
			right++
		}
		return left + 1, right
	}
	bestLeft, bestRight := 0, 1
	for center := range s {
		for _, offset := range [][2]int{{center, center}, {center, center + 1}} {
			left, right := expand(offset[0], offset[1])
			if right-left > bestRight-bestLeft {
				bestLeft, bestRight = left, right
			}
		}
	}
	return s[bestLeft:bestRight]
}`,
  11: `func maxArea(height []int) int {
	left, right, best := 0, len(height)-1, 0
	for left < right {
		h := height[left]
		if height[right] < h {
			h = height[right]
		}
		area := (right - left) * h
		if area > best {
			best = area
		}
		if height[left] < height[right] {
			left++
		} else {
			right--
		}
	}
	return best
}`,
  15: `import "sort"

func threeSum(nums []int) [][]int {
	sort.Ints(nums)
	ans := [][]int{}
	for i := 0; i < len(nums)-2; i++ {
		if nums[i] > 0 {
			break
		}
		if i > 0 && nums[i] == nums[i-1] {
			continue
		}
		left, right := i+1, len(nums)-1
		for left < right {
			sum := nums[i] + nums[left] + nums[right]
			if sum < 0 {
				left++
			} else if sum > 0 {
				right--
			} else {
				ans = append(ans, []int{nums[i], nums[left], nums[right]})
				for left < right && nums[left] == nums[left+1] {
					left++
				}
				for left < right && nums[right] == nums[right-1] {
					right--
				}
				left++
				right--
			}
		}
	}
	return ans
}`,
  17: `func letterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	letters := []string{"abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"}
	ans, path := []string{}, make([]byte, 0, len(digits))
	var dfs func(int)
	dfs = func(i int) {
		if i == len(digits) {
			ans = append(ans, string(path))
			return
		}
		for j := range letters[digits[i]-'2'] {
			path = append(path, letters[digits[i]-'2'][j])
			dfs(i + 1)
			path = path[:len(path)-1]
		}
	}
	dfs(0)
	return ans
}`,
  19: `func removeNthFromEnd(head *ListNode, n int) *ListNode {
	dummy := &ListNode{Next: head}
	fast, slow := dummy, dummy
	for i := 0; i < n; i++ {
		fast = fast.Next
	}
	for fast.Next != nil {
		fast = fast.Next
		slow = slow.Next
	}
	slow.Next = slow.Next.Next
	return dummy.Next
}`,
  20: `func isValid(s string) bool {
	stack := make([]byte, 0, len(s))
	for i := range s {
		switch s[i] {
		case '(', '[', '{':
			stack = append(stack, s[i])
		case ')', ']', '}':
			if len(stack) == 0 {
				return false
			}
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			if (s[i] == ')' && top != '(') ||
				(s[i] == ']' && top != '[') ||
				(s[i] == '}' && top != '{') {
				return false
			}
		}
	}
	return len(stack) == 0
}`,
  21: `func mergeTwoLists(list1, list2 *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	for list1 != nil && list2 != nil {
		if list1.Val < list2.Val {
			tail.Next, list1 = list1, list1.Next
		} else {
			tail.Next, list2 = list2, list2.Next
		}
		tail = tail.Next
	}
	if list1 != nil {
		tail.Next = list1
	} else {
		tail.Next = list2
	}
	return dummy.Next
}`,
  22: `func generateParenthesis(n int) []string {
	ans, path := []string{}, make([]byte, 0, 2*n)
	var dfs func(int, int)
	dfs = func(open, close int) {
		if len(path) == 2*n {
			ans = append(ans, string(path))
			return
		}
		if open < n {
			path = append(path, '(')
			dfs(open+1, close)
			path = path[:len(path)-1]
		}
		if close < open {
			path = append(path, ')')
			dfs(open, close+1)
			path = path[:len(path)-1]
		}
	}
	dfs(0, 0)
	return ans
}`,
  23: `func mergeKLists(lists []*ListNode) *ListNode {
	if len(lists) == 0 {
		return nil
	}
	return mergeKRange(lists, 0, len(lists)-1)
}

func mergeKRange(lists []*ListNode, left, right int) *ListNode {
	if left == right {
		return lists[left]
	}
	mid := left + (right-left)/2
	a := mergeKRange(lists, left, mid)
	b := mergeKRange(lists, mid+1, right)
	return mergeKTwo(a, b)
}

func mergeKTwo(a, b *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	for a != nil && b != nil {
		if a.Val < b.Val {
			tail.Next = a
			a = a.Next
		} else {
			tail.Next = b
			b = b.Next
		}
		tail = tail.Next
	}
	if a != nil {
		tail.Next = a
	} else {
		tail.Next = b
	}
	return dummy.Next
}`,
  24: `func swapPairs(head *ListNode) *ListNode {
	dummy := &ListNode{Next: head}
	prev := dummy
	for prev.Next != nil && prev.Next.Next != nil {
		a, b := prev.Next, prev.Next.Next
		prev.Next, a.Next, b.Next = b, b.Next, a
		prev = a
	}
	return dummy.Next
}`,
  25: `func reverseKGroup(head *ListNode, k int) *ListNode {
	dummy := &ListNode{Next: head}
	groupPrev := dummy
	for {
		kth := groupPrev // 先探测本组第 k 个节点
		for i := 0; i < k && kth != nil; i++ {
			kth = kth.Next
		}
		if kth == nil { // 不足 k 个，保留原顺序
			break
		}
		groupNext := kth.Next
		prev, current := groupNext, groupPrev.Next // 反转本组
		for current != groupNext {
			next := current.Next
			current.Next = prev
			prev, current = current, next
		}
		oldHead := groupPrev.Next // 旧组头变成组尾
		groupPrev.Next = kth      // 接上反转后的组头
		groupPrev = oldHead       // 从新组尾继续
	}
	return dummy.Next
}`,
  31: `func nextPermutation(nums []int) {
	i := len(nums) - 2
	for i >= 0 && nums[i] >= nums[i+1] {
		i--
	}
	if i >= 0 {
		j := len(nums) - 1
		for nums[j] <= nums[i] {
			j--
		}
		nums[i], nums[j] = nums[j], nums[i]
	}
	for left, right := i+1, len(nums)-1; left < right; left, right = left+1, right-1 {
		nums[left], nums[right] = nums[right], nums[left]
	}
}`,
  32: `func longestValidParentheses(s string) int {
	stack := []int{-1}
	best := 0
	for i := range s {
		if s[i] == '(' {
			stack = append(stack, i)
		} else {
			stack = stack[:len(stack)-1]
			if len(stack) == 0 {
				stack = append(stack, i)
			} else if i-stack[len(stack)-1] > best {
				best = i - stack[len(stack)-1]
			}
		}
	}
	return best
}`,
  33: `func search(nums []int, target int) int {
	left, right := 0, len(nums)-1
	for left <= right {
		mid := left + (right-left)/2
		if nums[mid] == target {
			return mid
		}
		if nums[left] <= nums[mid] {
			if nums[left] <= target && target < nums[mid] {
				right = mid - 1
			} else {
				left = mid + 1
			}
		} else if nums[mid] < target && target <= nums[right] {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}
	return -1
}`,
  34: `func searchRange(nums []int, target int) []int {
	lowerBound := func(value int) int {
		left, right := 0, len(nums)
		for left < right {
			mid := left + (right-left)/2
			if nums[mid] < value {
				left = mid + 1
			} else {
				right = mid
			}
		}
		return left
	}
	first := lowerBound(target)
	if first == len(nums) || nums[first] != target {
		return []int{-1, -1}
	}
	return []int{first, lowerBound(target+1) - 1}
}`,
  35: `func searchInsert(nums []int, target int) int {
	left, right := 0, len(nums)
	for left < right {
		mid := left + (right-left)/2
		if nums[mid] < target {
			left = mid + 1
		} else {
			right = mid
		}
	}
	return left
}`,
  39: `import "sort"

func combinationSum(candidates []int, target int) [][]int {
	sort.Ints(candidates)
	ans, path := [][]int{}, []int{}
	var dfs func(int, int)
	dfs = func(start, remain int) {
		if remain == 0 {
			ans = append(ans, append([]int(nil), path...))
			return
		}
		for i := start; i < len(candidates) && candidates[i] <= remain; i++ {
			path = append(path, candidates[i])
			dfs(i, remain-candidates[i])
			path = path[:len(path)-1]
		}
	}
	dfs(0, target)
	return ans
}`,
  41: `func firstMissingPositive(nums []int) int {
	n := len(nums)
	for i := 0; i < n; i++ {
		for nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i] {
			j := nums[i] - 1
			nums[i], nums[j] = nums[j], nums[i]
		}
	}
	for i, x := range nums {
		if x != i+1 {
			return i + 1
		}
	}
	return n + 1
}`,
  42: `func trap(height []int) int {
	left, right := 0, len(height)-1
	leftMax, rightMax, water := 0, 0, 0
	for left < right {
		if height[left] < height[right] {
			if height[left] > leftMax {
				leftMax = height[left]
			}
			water += leftMax - height[left]
			left++
		} else {
			if height[right] > rightMax {
				rightMax = height[right]
			}
			water += rightMax - height[right]
			right--
		}
	}
	return water
}`,
  45: `func jump(nums []int) int {
	jumps, currentEnd, farthest := 0, 0, 0
	for i := 0; i < len(nums)-1; i++ {
		if i+nums[i] > farthest {
			farthest = i + nums[i]
		}
		if i == currentEnd {
			jumps++
			currentEnd = farthest
			if currentEnd >= len(nums)-1 {
				break
			}
		}
	}
	return jumps
}`,
  46: `func permute(nums []int) [][]int {
	ans, path := [][]int{}, []int{}
	used := make([]bool, len(nums))
	var dfs func()
	dfs = func() {
		if len(path) == len(nums) {
			ans = append(ans, append([]int(nil), path...))
			return
		}
		for i, value := range nums {
			if used[i] {
				continue
			}
			used[i] = true
			path = append(path, value)
			dfs()
			path = path[:len(path)-1]
			used[i] = false
		}
	}
	dfs()
	return ans
}`,
  48: `func rotate(matrix [][]int) {
	n := len(matrix)
	for r := 0; r < n; r++ {
		for c := r + 1; c < n; c++ {
			matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
		}
	}
	for r := range matrix {
		for left, right := 0, n-1; left < right; left, right = left+1, right-1 {
			matrix[r][left], matrix[r][right] = matrix[r][right], matrix[r][left]
		}
	}
}`,
  49: `import "sort"

func groupAnagrams(strs []string) [][]string {
	groups := make(map[string][]string)
	for _, s := range strs {
		key := []byte(s)
		sort.Slice(key, func(i, j int) bool { return key[i] < key[j] })
		groups[string(key)] = append(groups[string(key)], s)
	}
	ans := make([][]string, 0, len(groups))
	for _, group := range groups {
		ans = append(ans, group)
	}
	return ans
}`,
  51: `func solveNQueens(n int) [][]string {
	ans := [][]string{}
	columns := make([]bool, n)
	diagonals := make([]bool, 2*n-1)
	antiDiagonals := make([]bool, 2*n-1)
	board := make([][]byte, n)
	for r := range board {
		board[r] = make([]byte, n)
		for c := range board[r] {
			board[r][c] = '.'
		}
	}
	var dfs func(int)
	dfs = func(row int) {
		if row == n {
			solution := make([]string, n)
			for r := range board {
				solution[r] = string(board[r])
			}
			ans = append(ans, solution)
			return
		}
		for col := 0; col < n; col++ {
			diagonal, anti := row-col+n-1, row+col
			if columns[col] || diagonals[diagonal] || antiDiagonals[anti] {
				continue
			}
			columns[col], diagonals[diagonal], antiDiagonals[anti] = true, true, true
			board[row][col] = 'Q'
			dfs(row + 1)
			board[row][col] = '.'
			columns[col], diagonals[diagonal], antiDiagonals[anti] = false, false, false
		}
	}
	dfs(0)
	return ans
}`,
  53: `func maxSubArray(nums []int) int {
	current, best := nums[0], nums[0]
	for _, x := range nums[1:] {
		if current < 0 {
			current = x
		} else {
			current += x
		}
		if current > best {
			best = current
		}
	}
	return best
}`,
  54: `func spiralOrder(matrix [][]int) []int {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return []int{}
	}
	top, bottom := 0, len(matrix)-1
	left, right := 0, len(matrix[0])-1
	ans := make([]int, 0, len(matrix)*len(matrix[0]))
	for top <= bottom && left <= right {
		for c := left; c <= right; c++ {
			ans = append(ans, matrix[top][c])
		}
		top++
		for r := top; r <= bottom; r++ {
			ans = append(ans, matrix[r][right])
		}
		right--
		if top <= bottom {
			for c := right; c >= left; c-- {
				ans = append(ans, matrix[bottom][c])
			}
			bottom--
		}
		if left <= right {
			for r := bottom; r >= top; r-- {
				ans = append(ans, matrix[r][left])
			}
			left++
		}
	}
	return ans
}`,
  55: `func canJump(nums []int) bool {
	farthest := 0
	for i, step := range nums {
		if i > farthest {
			return false
		}
		if i+step > farthest {
			farthest = i + step
		}
	}
	return true
}`,
  56: `import "sort"

func merge(intervals [][]int) [][]int {
	if len(intervals) == 0 {
		return [][]int{}
	}
	sort.Slice(intervals, func(i, j int) bool { return intervals[i][0] < intervals[j][0] })
	ans := [][]int{intervals[0]}
	for _, current := range intervals[1:] {
		last := ans[len(ans)-1]
		if current[0] <= last[1] {
			if current[1] > last[1] {
				last[1] = current[1]
			}
		} else {
			ans = append(ans, current)
		}
	}
	return ans
}`,
  62: `func uniquePaths(m int, n int) int {
	dp := make([]int, n)
	for c := range dp {
		dp[c] = 1
	}
	for r := 1; r < m; r++ {
		for c := 1; c < n; c++ {
			dp[c] += dp[c-1]
		}
	}
	return dp[n-1]
}`,
  64: `func minPathSum(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])
	dp := make([]int, cols)
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if r == 0 && c == 0 {
				dp[c] = grid[r][c]
			} else if r == 0 {
				dp[c] = dp[c-1] + grid[r][c]
			} else if c == 0 {
				dp[c] += grid[r][c]
			} else {
				if dp[c-1] < dp[c] {
					dp[c] = dp[c-1]
				}
				dp[c] += grid[r][c]
			}
		}
	}
	return dp[cols-1]
}`,
  70: `func climbStairs(n int) int {
	if n <= 2 {
		return n
	}
	previous, current := 1, 2
	for step := 3; step <= n; step++ {
		previous, current = current, previous+current
	}
	return current
}`,
  72: `func minDistance(word1 string, word2 string) int {
	dp := make([][]int, len(word1)+1)
	for i := range dp {
		dp[i] = make([]int, len(word2)+1)
		dp[i][0] = i
	}
	for j := 0; j <= len(word2); j++ {
		dp[0][j] = j
	}
	for i := 1; i <= len(word1); i++ {
		for j := 1; j <= len(word2); j++ {
			if word1[i-1] == word2[j-1] {
				dp[i][j] = dp[i-1][j-1]
			} else {
				replace, remove, insert := dp[i-1][j-1], dp[i-1][j], dp[i][j-1]
				if remove < replace {
					replace = remove
				}
				if insert < replace {
					replace = insert
				}
				dp[i][j] = replace + 1
			}
		}
	}
	return dp[len(word1)][len(word2)]
}`,
  73: `func setZeroes(matrix [][]int) {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return
	}
	rows, cols := len(matrix), len(matrix[0])
	firstRow, firstCol := false, false
	for c := 0; c < cols; c++ {
		firstRow = firstRow || matrix[0][c] == 0
	}
	for r := 0; r < rows; r++ {
		firstCol = firstCol || matrix[r][0] == 0
	}
	for r := 1; r < rows; r++ {
		for c := 1; c < cols; c++ {
			if matrix[r][c] == 0 {
				matrix[r][0], matrix[0][c] = 0, 0
			}
		}
	}
	for r := 1; r < rows; r++ {
		for c := 1; c < cols; c++ {
			if matrix[r][0] == 0 || matrix[0][c] == 0 {
				matrix[r][c] = 0
			}
		}
	}
	if firstRow {
		for c := range matrix[0] {
			matrix[0][c] = 0
		}
	}
	if firstCol {
		for r := range matrix {
			matrix[r][0] = 0
		}
	}
}`,
  74: `func searchMatrix(matrix [][]int, target int) bool {
	rows, cols := len(matrix), len(matrix[0])
	left, right := 0, rows*cols
	for left < right {
		mid := left + (right-left)/2
		value := matrix[mid/cols][mid%cols]
		if value < target {
			left = mid + 1
		} else {
			right = mid
		}
	}
	return left < rows*cols && matrix[left/cols][left%cols] == target
}`,
  75: `func sortColors(nums []int) {
	low, current, high := 0, 0, len(nums)-1
	for current <= high {
		switch nums[current] {
		case 0:
			nums[low], nums[current] = nums[current], nums[low]
			low++
			current++
		case 2:
			nums[current], nums[high] = nums[high], nums[current]
			high--
		default:
			current++
		}
	}
}`,
  76: `func minWindow(s string, t string) string {
	if len(t) == 0 || len(s) < len(t) {
		return ""
	}
	var need [128]int
	for i := range t {
		need[t[i]]++
	}
	missing, left := len(t), 0
	bestStart, bestLen := 0, len(s)+1
	for right := 0; right < len(s); right++ {
		if need[s[right]] > 0 {
			missing--
		}
		need[s[right]]--
		for missing == 0 {
			if right-left+1 < bestLen {
				bestStart, bestLen = left, right-left+1
			}
			need[s[left]]++
			if need[s[left]] > 0 {
				missing++
			}
			left++
		}
	}
	if bestLen > len(s) {
		return ""
	}
	return s[bestStart : bestStart+bestLen]
}`,
  78: `func subsets(nums []int) [][]int {
	ans, path := [][]int{}, []int{}
	var dfs func(int)
	dfs = func(start int) {
		ans = append(ans, append([]int(nil), path...))
		for i := start; i < len(nums); i++ {
			path = append(path, nums[i])
			dfs(i + 1)
			path = path[:len(path)-1]
		}
	}
	dfs(0)
	return ans
}`,
  79: `func exist(board [][]byte, word string) bool {
	rows, cols := len(board), len(board[0])
	var dfs func(int, int, int) bool
	dfs = func(r, c, i int) bool {
		if i == len(word) {
			return true
		}
		if r < 0 || r == rows || c < 0 || c == cols || board[r][c] != word[i] {
			return false
		}
		saved := board[r][c]
		board[r][c] = '#'
		found := dfs(r+1, c, i+1) || dfs(r-1, c, i+1) ||
			dfs(r, c+1, i+1) || dfs(r, c-1, i+1)
		board[r][c] = saved
		return found
	}
	for r := range board {
		for c := range board[r] {
			if dfs(r, c, 0) {
				return true
			}
		}
	}
	return false
}`,
  84: `func largestRectangleArea(heights []int) int {
	stack := []int{}
	best := 0
	for i := 0; i <= len(heights); i++ {
		current := 0
		if i < len(heights) {
			current = heights[i]
		}
		for len(stack) > 0 && heights[stack[len(stack)-1]] > current {
			height := heights[stack[len(stack)-1]]
			stack = stack[:len(stack)-1]
			left := -1
			if len(stack) > 0 {
				left = stack[len(stack)-1]
			}
			area := height * (i - left - 1)
			if area > best {
				best = area
			}
		}
		stack = append(stack, i)
	}
	return best
}`,
  94: `func inorderTraversal(root *TreeNode) []int {
	ans := []int{}
	stack := []*TreeNode{}
	for root != nil || len(stack) > 0 {
		for root != nil {
			stack = append(stack, root)
			root = root.Left
		}
		root = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		ans = append(ans, root.Val)
		root = root.Right
	}
	return ans
}`,
  98: `func isValidBST(root *TreeNode) bool {
	var prev *TreeNode
	valid := true
	var inorder func(*TreeNode)
	inorder = func(node *TreeNode) {
		if node == nil || !valid {
			return
		}
		inorder(node.Left)
		if prev != nil && prev.Val >= node.Val {
			valid = false
			return
		}
		prev = node
		inorder(node.Right)
	}
	inorder(root)
	return valid
}`,
  101: `func isSymmetric(root *TreeNode) bool {
	var same func(*TreeNode, *TreeNode) bool
	same = func(a, b *TreeNode) bool {
		if a == nil || b == nil {
			return a == b
		}
		return a.Val == b.Val && same(a.Left, b.Right) && same(a.Right, b.Left)
	}
	return root == nil || same(root.Left, root.Right)
}`,
  102: `func levelOrder(root *TreeNode) [][]int {
	if root == nil {
		return [][]int{}
	}
	queue := []*TreeNode{root}
	ans := [][]int{}
	for head := 0; head < len(queue); {
		end := len(queue)
		level := make([]int, 0, end-head)
		for head < end {
			node := queue[head]
			head++
			level = append(level, node.Val)
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		ans = append(ans, level)
	}
	return ans
}`,
  104: `func maxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	left, right := maxDepth(root.Left), maxDepth(root.Right)
	if left > right {
		return left + 1
	}
	return right + 1
}`,
  105: `func buildTree(preorder []int, inorder []int) *TreeNode {
	positions := make(map[int]int, len(inorder))
	for i, value := range inorder {
		positions[value] = i
	}
	preIndex := 0
	var build func(int, int) *TreeNode
	build = func(left, right int) *TreeNode {
		if left >= right {
			return nil
		}
		value := preorder[preIndex]
		preIndex++
		mid := positions[value]
		return &TreeNode{
			Val:   value,
			Left:  build(left, mid),
			Right: build(mid+1, right),
		}
	}
	return build(0, len(inorder))
}`,
  108: `func sortedArrayToBST(nums []int) *TreeNode {
	var build func(int, int) *TreeNode
	build = func(left, right int) *TreeNode {
		if left > right {
			return nil
		}
		mid := left + (right-left)/2
		node := &TreeNode{Val: nums[mid]}
		node.Left = build(left, mid-1)
		node.Right = build(mid+1, right)
		return node
	}
	return build(0, len(nums)-1)
}`,
  114: `func flatten(root *TreeNode) {
	var prev *TreeNode
	var preorder func(*TreeNode)
	preorder = func(node *TreeNode) {
		if node == nil {
			return
		}
		preorder(node.Right)
		preorder(node.Left)
		node.Right, node.Left = prev, nil
		prev = node
	}
	preorder(root)
}`,
  118: `func generate(numRows int) [][]int {
	triangle := make([][]int, numRows)
	for r := 0; r < numRows; r++ {
		triangle[r] = make([]int, r+1)
		triangle[r][0], triangle[r][r] = 1, 1
		for c := 1; c < r; c++ {
			triangle[r][c] = triangle[r-1][c-1] + triangle[r-1][c]
		}
	}
	return triangle
}`,
  121: `func maxProfit(prices []int) int {
	minPrice, best := prices[0], 0
	for _, price := range prices[1:] {
		if price-minPrice > best {
			best = price - minPrice
		}
		if price < minPrice {
			minPrice = price
		}
	}
	return best
}`,
  124: `func maxPathSum(root *TreeNode) int {
	best := root.Val
	var gain func(*TreeNode) int
	gain = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		left, right := gain(node.Left), gain(node.Right)
		if left < 0 {
			left = 0
		}
		if right < 0 {
			right = 0
		}
		if left+right+node.Val > best {
			best = left + right + node.Val
		}
		if left > right {
			return node.Val + left
		}
		return node.Val + right
	}
	gain(root)
	return best
}`,
  128: `func longestConsecutive(nums []int) int {
	set := make(map[int]bool, len(nums))
	for _, x := range nums {
		set[x] = true
	}
	best := 0
	for x := range set {
		if set[x-1] {
			continue
		}
		length := 1
		for set[x+length] {
			length++
		}
		if length > best {
			best = length
		}
	}
	return best
}`,
  131: `func partition(s string) [][]string {
	ans, path := [][]string{}, []string{}
	isPalindrome := func(left, right int) bool {
		for left < right {
			if s[left] != s[right] {
				return false
			}
			left++
			right--
		}
		return true
	}
	var dfs func(int)
	dfs = func(start int) {
		if start == len(s) {
			ans = append(ans, append([]string(nil), path...))
			return
		}
		for end := start; end < len(s); end++ {
			if !isPalindrome(start, end) {
				continue
			}
			path = append(path, s[start:end+1])
			dfs(end + 1)
			path = path[:len(path)-1]
		}
	}
	dfs(0)
	return ans
}`,
  136: `func singleNumber(nums []int) int {
	answer := 0
	for _, x := range nums {
		answer ^= x
	}
	return answer
}`,
  138: `func copyRandomList(head *Node) *Node {
	copies := make(map[*Node]*Node)
	for node := head; node != nil; node = node.Next {
		copies[node] = &Node{Val: node.Val}
	}
	for node := head; node != nil; node = node.Next {
		copies[node].Next = copies[node.Next]
		copies[node].Random = copies[node.Random]
	}
	return copies[head]
}`,
  139: `func wordBreak(s string, wordDict []string) bool {
	words := make(map[string]bool, len(wordDict))
	for _, word := range wordDict {
		words[word] = true
	}
	dp := make([]bool, len(s)+1)
	dp[0] = true
	for end := 1; end <= len(s); end++ {
		for start := 0; start < end; start++ {
			if dp[start] && words[s[start:end]] {
				dp[end] = true
				break
			}
		}
	}
	return dp[len(s)]
}`,
  141: `func hasCycle(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			return true
		}
	}
	return false
}`,
  142: `func detectCycle(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			for slow != head {
				slow = slow.Next
				head = head.Next
			}
			return head
		}
	}
	return nil
}`,
  146: `import "container/list"

type LRUCache struct {
	capacity int
	items    map[int]*list.Element
	order    *list.List
}
type cacheEntry struct{ key, value int }

func Constructor(capacity int) LRUCache {
	return LRUCache{capacity: capacity, items: make(map[int]*list.Element), order: list.New()}
}
func (c *LRUCache) Get(key int) int {
	if element, ok := c.items[key]; ok {
		c.order.MoveToFront(element)
		return element.Value.(cacheEntry).value
	}
	return -1
}
func (c *LRUCache) Put(key, value int) {
	if element, ok := c.items[key]; ok {
		element.Value = cacheEntry{key, value}
		c.order.MoveToFront(element)
		return
	}
	element := c.order.PushFront(cacheEntry{key, value})
	c.items[key] = element
	if c.order.Len() > c.capacity {
		oldest := c.order.Back()
		delete(c.items, oldest.Value.(cacheEntry).key)
		c.order.Remove(oldest)
	}
}`,
  148: `func sortList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	slow, fast := head, head.Next // fast 先走一步，避免两节点时死循环
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	mid := slow.Next
	slow.Next = nil // 断开两半
	left := sortList(head)
	right := sortList(mid)
	return mergeSortedLists(left, right)
}

func mergeSortedLists(a, b *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	for a != nil && b != nil {
		if a.Val <= b.Val {
			tail.Next = a
			a = a.Next
		} else {
			tail.Next = b
			b = b.Next
		}
		tail = tail.Next
	}
	if a != nil {
		tail.Next = a
	} else {
		tail.Next = b
	}
	return dummy.Next
}`,
  152: `func maxProduct(nums []int) int {
	maxHere, minHere, best := nums[0], nums[0], nums[0]
	for _, x := range nums[1:] {
		if x < 0 {
			maxHere, minHere = minHere, maxHere
		}
		if maxHere*x < x {
			maxHere = x
		} else {
			maxHere *= x
		}
		if minHere*x > x {
			minHere = x
		} else {
			minHere *= x
		}
		if maxHere > best {
			best = maxHere
		}
	}
	return best
}`,
  153: `func findMin(nums []int) int {
	left, right := 0, len(nums)-1
	for left < right {
		mid := left + (right-left)/2
		if nums[mid] > nums[right] {
			left = mid + 1
		} else {
			right = mid
		}
	}
	return nums[left]
}`,
  155: `type MinStack struct {
	values []int
	mins   []int
}

func Constructor() MinStack { return MinStack{} }
func (s *MinStack) Push(val int) {
	s.values = append(s.values, val)
	if len(s.mins) == 0 || val <= s.mins[len(s.mins)-1] {
		s.mins = append(s.mins, val)
	}
}
func (s *MinStack) Pop() {
	last := len(s.values) - 1
	if s.values[last] == s.mins[len(s.mins)-1] {
		s.mins = s.mins[:len(s.mins)-1]
	}
	s.values = s.values[:last]
}
func (s *MinStack) Top() int    { return s.values[len(s.values)-1] }
func (s *MinStack) GetMin() int { return s.mins[len(s.mins)-1] }`,
  160: `func getIntersectionNode(headA, headB *ListNode) *ListNode {
	a, b := headA, headB
	for a != b {
		if a == nil {
			a = headB
		} else {
			a = a.Next
		}
		if b == nil {
			b = headA
		} else {
			b = b.Next
		}
	}
	return a
}`,
  169: `func majorityElement(nums []int) int {
	candidate, count := 0, 0
	for _, x := range nums {
		if count == 0 {
			candidate = x
		}
		if x == candidate {
			count++
		} else {
			count--
		}
	}
	return candidate
}`,
  189: `func rotate(nums []int, k int) {
	n := len(nums)
	if n == 0 {
		return
	}
	k %= n
	reverse := func(left, right int) {
		for left < right {
			nums[left], nums[right] = nums[right], nums[left]
			left++
			right--
		}
	}
	reverse(0, n-1)
	reverse(0, k-1)
	reverse(k, n-1)
}`,
  198: `func rob(nums []int) int {
	previous, current := 0, 0
	for _, money := range nums {
		next := previous + money
		if current > next {
			next = current
		}
		previous, current = current, next
	}
	return current
}`,
  199: `func rightSideView(root *TreeNode) []int {
	if root == nil {
		return []int{}
	}
	queue, ans := []*TreeNode{root}, []int{}
	for head := 0; head < len(queue); {
		end := len(queue)
		for head < end {
			node := queue[head]
			head++
			if head == end {
				ans = append(ans, node.Val)
			}
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
	}
	return ans
}`,
  200: `func numIslands(grid [][]byte) int {
	if len(grid) == 0 {
		return 0
	}
	rows, cols, islands := len(grid), len(grid[0]), 0
	var visit func(int, int)
	visit = func(r, c int) {
		if r < 0 || r == rows || c < 0 || c == cols || grid[r][c] != '1' {
			return
		}
		grid[r][c] = '0'
		visit(r+1, c)
		visit(r-1, c)
		visit(r, c+1)
		visit(r, c-1)
	}
	for r := range grid {
		for c := range grid[r] {
			if grid[r][c] == '1' {
				islands++
				visit(r, c)
			}
		}
	}
	return islands
}`,
  206: `func reverseList(head *ListNode) *ListNode {
	var prev *ListNode
	for head != nil {
		next := head.Next
		head.Next = prev
		prev = head
		head = next
	}
	return prev
}`,
  207: `func canFinish(numCourses int, prerequisites [][]int) bool {
	graph := make([][]int, numCourses)
	indegree := make([]int, numCourses)
	for _, edge := range prerequisites {
		course, prerequisite := edge[0], edge[1]
		graph[prerequisite] = append(graph[prerequisite], course)
		indegree[course]++
	}
	queue := []int{}
	for course, degree := range indegree {
		if degree == 0 {
			queue = append(queue, course)
		}
	}
	completed := 0
	for head := 0; head < len(queue); head++ {
		course := queue[head]
		completed++
		for _, next := range graph[course] {
			indegree[next]--
			if indegree[next] == 0 {
				queue = append(queue, next)
			}
		}
	}
	return completed == numCourses
}`,
  208: `type Trie struct {
	children [26]*Trie
	end      bool
}

func Constructor() Trie { return Trie{} }

func (t *Trie) Insert(word string) {
	node := t
	for i := range word {
		index := word[i] - 'a'
		if node.children[index] == nil {
			node.children[index] = &Trie{}
		}
		node = node.children[index]
	}
	node.end = true
}
func (t *Trie) Search(word string) bool {
	node := t.find(word)
	return node != nil && node.end
}
func (t *Trie) StartsWith(prefix string) bool { return t.find(prefix) != nil }
func (t *Trie) find(s string) *Trie {
	node := t
	for i := range s {
		node = node.children[s[i]-'a']
		if node == nil {
			return nil
		}
	}
	return node
}`,
  215: `import (
	"math/rand"
	"time"
)

func findKthLargest(nums []int, k int) int {
	random := rand.New(rand.NewSource(time.Now().UnixNano()))
	return quickSelect(nums, 0, len(nums)-1, len(nums)-k, random)
}

func quickSelect(nums []int, left, right, target int, random *rand.Rand) int {
	pivotIndex := left + random.Intn(right-left+1) // 随机 pivot 防止固定输入退化
	pivotIndex = partition(nums, left, right, pivotIndex)
	if pivotIndex == target {
		return nums[pivotIndex]
	}
	if pivotIndex < target {
		return quickSelect(nums, pivotIndex+1, right, target, random)
	}
	return quickSelect(nums, left, pivotIndex-1, target, random)
}

func partition(nums []int, left, right, pivotIndex int) int {
	pivot := nums[pivotIndex]
	swap(nums, pivotIndex, right)
	store := left
	for i := left; i < right; i++ {
		if nums[i] < pivot {
			swap(nums, i, store)
			store++
		}
	}
	swap(nums, store, right)
	return store
}

func swap(nums []int, i, j int) {
	nums[i], nums[j] = nums[j], nums[i]
}`,
  226: `func invertTree(root *TreeNode) *TreeNode {
	if root == nil {
		return nil
	}
	root.Left, root.Right = invertTree(root.Right), invertTree(root.Left)
	return root
}`,
  230: `func kthSmallest(root *TreeNode, k int) int {
	stack := []*TreeNode{}
	for root != nil || len(stack) > 0 {
		for root != nil {
			stack = append(stack, root)
			root = root.Left
		}
		root = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		k--
		if k == 0 {
			return root.Val
		}
		root = root.Right
	}
	return -1
}`,
  234: `func isPalindrome(head *ListNode) bool {
	if head == nil || head.Next == nil {
		return true
	}
	slow, fast := head, head
	for fast.Next != nil && fast.Next.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
	second := reverseListHalf(slow.Next) // 奇数长度时跳过中点，再反转后半段
	left, right := head, second
	for right != nil {
		if left.Val != right.Val {
			return false
		}
		left = left.Next
		right = right.Next
	}
	return true
}

func reverseListHalf(head *ListNode) *ListNode {
	var previous *ListNode
	for head != nil {
		next := head.Next
		head.Next = previous
		previous = head
		head = next
	}
	return previous
}`,
  236: `func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
	if root == nil || root == p || root == q {
		return root
	}
	left := lowestCommonAncestor(root.Left, p, q)
	right := lowestCommonAncestor(root.Right, p, q)
	if left != nil && right != nil {
		return root
	}
	if left != nil {
		return left
	}
	return right
}`,
  238: `func productExceptSelf(nums []int) []int {
	ans := make([]int, len(nums))
	prefix := 1
	for i, x := range nums {
		ans[i] = prefix
		prefix *= x
	}
	suffix := 1
	for i := len(nums) - 1; i >= 0; i-- {
		ans[i] *= suffix
		suffix *= nums[i]
	}
	return ans
}`,
  239: `func maxSlidingWindow(nums []int, k int) []int {
	if k == 0 || len(nums) == 0 {
		return []int{}
	}
	deque := []int{} // 存下标，队列对应的值保持递减
	ans := make([]int, 0, len(nums)-k+1)
	for i, x := range nums {
		if len(deque) > 0 && deque[0] <= i-k {
			deque = deque[1:] // 移除过期下标
		}
		for len(deque) > 0 && nums[deque[len(deque)-1]] <= x {
			deque = deque[:len(deque)-1]
		}
		deque = append(deque, i)
		if i >= k-1 {
			ans = append(ans, nums[deque[0]])
		}
	}
	return ans
}`,
  240: `func searchMatrix(matrix [][]int, target int) bool {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return false
	}
	r, c := 0, len(matrix[0])-1
	for r < len(matrix) && c >= 0 {
		if matrix[r][c] == target {
			return true
		}
		if matrix[r][c] > target {
			c--
		} else {
			r++
		}
	}
	return false
}`,
  279: `func numSquares(n int) int {
	dp := make([]int, n+1)
	for value := 1; value <= n; value++ {
		dp[value] = value
		for square := 1; square*square <= value; square++ {
			if candidate := dp[value-square*square] + 1; candidate < dp[value] {
				dp[value] = candidate
			}
		}
	}
	return dp[n]
}`,
  283: `func moveZeroes(nums []int) {
	next := 0
	for i, x := range nums {
		if x != 0 {
			nums[next], nums[i] = nums[i], nums[next]
			next++
		}
	}
}`,
  287: `func findDuplicate(nums []int) int {
	slow, fast := nums[0], nums[0]
	for {
		slow = nums[slow]
		fast = nums[nums[fast]]
		if slow == fast {
			break
		}
	}
	slow = nums[0]
	for slow != fast {
		slow = nums[slow]
		fast = nums[fast]
	}
	return slow
}`,
  295: `import "container/heap"

// max=true 时是大顶堆，否则是小顶堆。
type medianHeap struct {
	values []int
	max    bool
}

func (h medianHeap) Len() int { return len(h.values) }
func (h medianHeap) Less(i, j int) bool {
	if h.max {
		return h.values[i] > h.values[j]
	}
	return h.values[i] < h.values[j]
}
func (h medianHeap) Swap(i, j int)   { h.values[i], h.values[j] = h.values[j], h.values[i] }
func (h *medianHeap) Push(value any) { h.values = append(h.values, value.(int)) }
func (h *medianHeap) Pop() any {
	last := len(h.values) - 1
	value := h.values[last]
	h.values = h.values[:last]
	return value
}

type MedianFinder struct {
	lower *medianHeap // 大顶堆，保存较小的一半
	upper *medianHeap // 小顶堆，保存较大的一半
}

func Constructor() MedianFinder {
	lower, upper := &medianHeap{max: true}, &medianHeap{}
	heap.Init(lower)
	heap.Init(upper)
	return MedianFinder{lower: lower, upper: upper}
}
func (m *MedianFinder) AddNum(num int) {
	heap.Push(m.lower, num)
	heap.Push(m.upper, heap.Pop(m.lower)) // 把下半部分最大值移到上半部分
	if m.upper.Len() > m.lower.Len() {
		heap.Push(m.lower, heap.Pop(m.upper))
	}
}
func (m *MedianFinder) FindMedian() float64 {
	if m.lower.Len() > m.upper.Len() {
		return float64(m.lower.values[0])
	}
	return (float64(m.lower.values[0]) + float64(m.upper.values[0])) / 2
}`,
  300: `func lengthOfLIS(nums []int) int {
	tails := []int{}
	for _, x := range nums {
		left, right := 0, len(tails)
		for left < right {
			mid := left + (right-left)/2
			if tails[mid] < x {
				left = mid + 1
			} else {
				right = mid
			}
		}
		if left == len(tails) {
			tails = append(tails, x)
		} else {
			tails[left] = x
		}
	}
	return len(tails)
}`,
  322: `func coinChange(coins []int, amount int) int {
	dp := make([]int, amount+1)
	for value := 1; value <= amount; value++ {
		dp[value] = amount + 1
		for _, coin := range coins {
			if coin <= value && dp[value-coin]+1 < dp[value] {
				dp[value] = dp[value-coin] + 1
			}
		}
	}
	if dp[amount] > amount {
		return -1
	}
	return dp[amount]
}`,
  347: `func topKFrequent(nums []int, k int) []int {
	frequency := make(map[int]int)
	for _, x := range nums {
		frequency[x]++
	}
	buckets := make([][]int, len(nums)+1)
	for value, count := range frequency {
		buckets[count] = append(buckets[count], value)
	}
	ans := make([]int, 0, k)
	for count := len(buckets) - 1; count > 0 && len(ans) < k; count-- {
		ans = append(ans, buckets[count]...)
	}
	return ans[:k]
}`,
  394: `import "strings"

func decodeString(s string) string {
	counts, prefixes := []int{}, []string{}
	current, number := "", 0
	for i := range s {
		switch {
		case s[i] >= '0' && s[i] <= '9':
			number = number*10 + int(s[i]-'0')
		case s[i] == '[':
			counts = append(counts, number)
			prefixes = append(prefixes, current)
			current, number = "", 0
		case s[i] == ']':
			count := counts[len(counts)-1]
			counts = counts[:len(counts)-1]
			prefix := prefixes[len(prefixes)-1]
			prefixes = prefixes[:len(prefixes)-1]
			current = prefix + strings.Repeat(current, count)
		default:
			current += string(s[i])
		}
	}
	return current
}`,
  416: `func canPartition(nums []int) bool {
	total := 0
	for _, x := range nums {
		total += x
	}
	if total%2 != 0 {
		return false
	}
	target := total / 2
	dp := make([]bool, target+1)
	dp[0] = true
	for _, x := range nums {
		for sum := target; sum >= x; sum-- {
			dp[sum] = dp[sum] || dp[sum-x]
		}
	}
	return dp[target]
}`,
  437: `func pathSum(root *TreeNode, targetSum int) int {
	prefixCount := map[int]int{0: 1}
	var dfs func(*TreeNode, int) int
	dfs = func(node *TreeNode, sum int) int {
		if node == nil {
			return 0
		}
		sum += node.Val
		paths := prefixCount[sum-targetSum]
		prefixCount[sum]++
		paths += dfs(node.Left, sum) + dfs(node.Right, sum)
		prefixCount[sum]--
		return paths
	}
	return dfs(root, 0)
}`,
  438: `func findAnagrams(s string, p string) []int {
	ans := []int{}
	if len(s) < len(p) {
		return ans
	}
	var need, window [26]int
	for i := range p {
		need[p[i]-'a']++
	}
	for right := range s {
		window[s[right]-'a']++
		if right >= len(p) {
			window[s[right-len(p)]-'a']--
		}
		if right >= len(p)-1 && window == need {
			ans = append(ans, right-len(p)+1)
		}
	}
	return ans
}`,
  543: `func diameterOfBinaryTree(root *TreeNode) int {
	diameter := 0
	var depth func(*TreeNode) int
	depth = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		left, right := depth(node.Left), depth(node.Right)
		if left+right > diameter {
			diameter = left + right
		}
		if left > right {
			return left + 1
		}
		return right + 1
	}
	depth(root)
	return diameter
}`,
  560: `func subarraySum(nums []int, k int) int {
	count := map[int]int{0: 1}
	prefix, ans := 0, 0
	for _, x := range nums {
		prefix += x
		ans += count[prefix-k]
		count[prefix]++
	}
	return ans
}`,
  739: `func dailyTemperatures(temperatures []int) []int {
	ans := make([]int, len(temperatures))
	stack := []int{}
	for i, temperature := range temperatures {
		for len(stack) > 0 && temperature > temperatures[stack[len(stack)-1]] {
			previous := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			ans[previous] = i - previous
		}
		stack = append(stack, i)
	}
	return ans
}`,
  763: `func partitionLabels(s string) []int {
	var last [26]int
	for i := range s {
		last[s[i]-'a'] = i
	}
	ans := []int{}
	start, end := 0, 0
	for i := range s {
		if last[s[i]-'a'] > end {
			end = last[s[i]-'a']
		}
		if i == end {
			ans = append(ans, end-start+1)
			start = i + 1
		}
	}
	return ans
}`,
  994: `func orangesRotting(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])
	queue, fresh := [][2]int{}, 0
	for r := range grid {
		for c, value := range grid[r] {
			if value == 2 {
				queue = append(queue, [2]int{r, c})
			} else if value == 1 {
				fresh++
			}
		}
	}
	minutes := 0
	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	for head := 0; head < len(queue) && fresh > 0; {
		end := len(queue)
		for head < end {
			cell := queue[head]
			head++
			for _, d := range dirs {
				r, c := cell[0]+d[0], cell[1]+d[1]
				if r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] == 1 {
					grid[r][c] = 2
					fresh--
					queue = append(queue, [2]int{r, c})
				}
			}
		}
		minutes++
	}
	if fresh > 0 {
		return -1
	}
	return minutes
}`,
  1143: `func longestCommonSubsequence(text1 string, text2 string) int {
	dp := make([][]int, len(text1)+1)
	for i := range dp {
		dp[i] = make([]int, len(text2)+1)
	}
	for i := 1; i <= len(text1); i++ {
		for j := 1; j <= len(text2); j++ {
			if text1[i-1] == text2[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else if dp[i-1][j] > dp[i][j-1] {
				dp[i][j] = dp[i-1][j]
			} else {
				dp[i][j] = dp[i][j-1]
			}
		}
	}
	return dp[len(text1)][len(text2)]
}`,
};
