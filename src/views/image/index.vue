<template>
	<div>
		<el-container style="position: absolute;top: 55px;bottom: 0;left: 0;right: 0;">
			<el-header class="d-flex align-items-center border-bottom">
				<div class="d-flex mr-auto">
					<el-select v-model="searchForm.order" placeholder="请选择图片的排序方式" size="mini" style="width: 150px;" class="mr-2">
						<el-option label="降序" value="desc"></el-option>
						<el-option label="升序" value="asc"></el-option>
					</el-select>
					<el-input v-model="searchForm.keyword" size="mini" style="width: 150px;" class="mr-2"
						placeholder="输入图片名称"></el-input>
					<el-button type="success" size="mini" @click="getImageList">搜索</el-button>

				</div>
				<el-button type="warning" size="mini" @click="unChoose" v-if="chooseList.length">取消选中</el-button>
				<el-button type="danger" size="mini" @click="imageDel({ all: true })" v-if="chooseList.length">批量删除</el-button>
				<el-button type="success" size="mini" @click="openAlbumModel(false)">创建相册</el-button>
				<el-button type="warning" size="mini" @click="uploadModel = true">上传图片</el-button>

			</el-header>
			<el-container>
				<el-aside width="200px" style="position: absolute;top: 60px;left: 0px;bottom: 60px;"
					class="bg-white border-right">
					<!-- 侧边 | 相册列表 -->
					<ul class="list-group list-group-flush">
						<album-item v-for="(item, index) in albums" :key="index" :item="item" :index="index"
							:active="albumsIndex == index" @change="albumsChange" @edit="openAlbumModel" @del="albumDel"></album-item>
					</ul>
				</el-aside>
				<el-container>
					<el-main style="position: absolute;top: 60px;left: 200px;bottom: 60px;right: 0;">
						<!-- 主内容 -->
						<el-row :gutter="10">
							<el-col :span="24" :lg="4" :md="6" :sm="8" v-for="(item, index) in imageList" :key="index">
								<el-card class="box-card mb-3 position-relative" :body-style="{ 'padding': '0' }" shadow="hover"
									style="cursor: pointer;">
									<div class="border" :class="{ 'border-danger': item.ischeck }">
										<!-- 当el-tag中使用v-if时,频繁操作多张图片会造成很严重的卡顿,解决方法:使用原生的标签 -->
										<span class="badge badge-danger" style="position: absolute;right:0;top:0;" v-if="item.ischeck">{{
											item.checkOrder }}</span>
										<!-- <el-tag type="danger" effect="dark" style="position: absolute;right:0;top:0;" size="mini"
											v-if="item.ischeck">1</el-tag> -->
										<img :src="item.url" class="w-100" style="height: 100px;" @click="choose(item)" />
										<div class="w-100 text-white position-absolute px-2"
											style="background: rgba(0,0,0,0.5);margin-top: -27px;">
											<span class="small">{{ item.name }}</span>
										</div>
										<div class="text-center p-2">
											<el-button-group>
												<el-button size="mini" icon="el-icon-view" class="p-2" @click="previewImage(item)"></el-button>
												<el-button size="mini" icon="el-icon-edit" class="p-2"
													@click="imageEdit(item, index)"></el-button>
												<el-button size="mini" icon="el-icon-delete" class="p-2"
													@click="imageDel({ item, index })"></el-button>
											</el-button-group>
										</div>
									</div>
								</el-card>
							</el-col>
						</el-row>
					</el-main>
				</el-container>
			</el-container>
			<el-footer class="border-top d-flex align-items-center px-0">
				<div style="width:200px;flex-shrink:0"
					class="h-100 d-flex align-items-center justify-content-center border-right">
					<el-button-group>
						<el-button size="mini" :disabled="albumPage === 1" @click="changeAlbumPage('pre')"><i
								class="el-icon-arrow-left el-icon--left"></i>上一页</el-button>
						<!-- Math.ceil()向上取整:大于等于参数的最小整数 -->
						<el-button size="mini" @click="changeAlbumPage('next')"
							:disabled="albumPage === Math.ceil(albumTotal / 10)">下一页<i
								class="el-icon-arrow-right el-icon--right"></i></el-button>
					</el-button-group>

				</div>
				<div style="flex:1;" class="px-2">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
						:page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</el-footer>
		</el-container>

		<!-- 修改 | 创建相册 -->
		<el-dialog :title="albumModelTitle" :visible.sync="albumModel">
			<el-form ref="albumForm" :model="albumForm" label-width="80px">
				<el-form-item label="相册名称">
					<el-input v-model="albumForm.name" size="medium" placeholder="请输入相册名称"></el-input>
				</el-form-item>
				<el-form-item label="活动区域">
					<el-input-number v-model="albumForm.order" :min="1" size="medium"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="albumModel = false">取 消</el-button>
				<el-button type="primary" @click="confirmAlbumModel">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 上传图片 -->
		<el-dialog title="上传图片" :visible.sync="uploadModel" @close="__init">
			<div class="text-center">
				<el-upload class="upload-demo " drag action="/admin/image/upload" multiple
					:headers="{ token: $store.state.user.token }" :data="{ image_class_id: image_class_id }" name="img"
					:on-success="uploadSuccess">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</div>
		</el-dialog>

		<!-- 预览图片 -->
		<el-dialog :visible.sync="priviewModel" width="60vw" top="5vh">
			<div style="margin: -60px -20px -30px -20px;"><img :src="previewUrl" class="w-100" />
			</div>
		</el-dialog>


	</div>
</template>
<script>
import albumItem from '@/components/image/album-item.vue';
export default {
	inject: ['layout'],
	components: {
		albumItem
	},
	data () {
		return {
			searchForm: {
				order: "desc",
				keyword: ""
			},
			albums: [],
			albumPage: 1,
			albumTotal: 0,
			albumsIndex: "0",
			albumModel: false,
			albumEditIndex: -1,
			albumForm: {
				name: "",
				order: ""
			},
			uploadModel: false,
			priviewModel: false,
			previewUrl: "",
			imageList: [],
			// 选中数组
			chooseList: [],
			currentPage: 1,
			pageSize: 10,
			pageSizes: [10, 20, 50, 100],
			total: 10
		}
	},
	computed: {
		albumModelTitle () {
			return this.albumEditIndex > -1 ? "修改相册" : "创建相册";
		},
		// 选中相册id
		image_class_id () {
			let item = this.albums[this.albumsIndex]
			if (item) {
				return item.id
			}
		},
		// 当前选中相册的图片列表URL
		getImageListUrl () {
			let other = ''
			if (this.searchForm.keyword !== '') {
				other = `&keyword=${this.searchForm.keyword}`
			}
			return `admin/imageclass/${this.image_class_id}/image/${this.currentPage}?limit=${this.pageSize}&order=${this.searchForm.order}${other}`
		}
	},
	created () {
		this.__init();
	},
	methods: {
		// 取消选中
		unChoose () {
			this.imageList.forEach(img => {
				// 找到所有选中的图片
				let i = this.chooseList.findIndex(item => item.id === img.id);
				if (i > -1) {
					// 取消选中样式，选中排序归零
					img.ischeck = false;
					img.checkOrder = 0;
					// 从chooseList中移除
					this.chooseList.splice(i, 1);
				}
			})
		},
		// 选中图片
		choose (item) {
			if (!item.ischeck) {
				this.chooseList.push({
					id: item.id,
					url: item.url
				});
				// 计算序号
				item.checkOrder = this.chooseList.length;
				// 修改状态
				item.ischeck = true;
				return;
			}

			// 取消选中
			// 找到在chooseList中的索引,删除
			let i = this.chooseList.findIndex(v => v.id === item.id);
			if (i === -1) return;
			// 重新计算序号
			let length = this.chooseList.length;
			// 取消选中中间部分
			if (i + 1 < length) {
				//重新计算imageList中
				for (let j = i; j < length; j++) {
					let no = this.imageList.findIndex(v => v.id === this.chooseList[j].id);
					if (no > -1) {
						this.imageList[no].checkOrder--;
					}
				}
			}
			// 删除
			this.chooseList.splice(i, 1);
			// 修改状态
			item.ischeck = false;
			// 重置序号
			item.checkOrder = 0;
		},
		// 获取对应相册下的图片列表
		getImageList () {
			this.layout.showLoading()
			this.axios.get(this.getImageListUrl, {
				token: true
			}).then(res => {
				let result = res.data.data
				this.imageList = result.list.map(item => {
					return {
						id: item.id,
						url: item.url,
						name: item.name,
						ischeck: false,
						checkOrder: 0
					}
				})
				this.total = result.totalCount
				this.layout.hideLoading()
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		__init () {
			this.layout.showLoading()
			// 获取相册列表
			this.axios.get('/admin/imageclass/' + this.albumPage, {
				token: true
			}).then(res => {
				let result = res.data.data
				this.albums = result.list
				this.albumTotal = result.totalCount

				// 获取选中相册下的第一页图片列表
				this.getImageList()
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		albumsChange (index) {
			this.albumsIndex = index;
			this.getImageList()
		},
		albumDel (index) {
			this.$confirm('是否删除该相册?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let id = this.albums[index].id
				this.layout.showLoading()
				this.axios.delete('/admin/imageclass/' + id, {
					token: true
				}).then(res => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.__init()

				}).catch(err => {
					this.layout.hideLoading()
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		// 打开相册修改|创建框
		openAlbumModel (obj) {
			// 修改
			if (obj) {
				let { item, index } = obj;
				// 初始化表单
				this.albumForm.name = item.name;
				this.albumForm.order = item.order;
				this.albumEditIndex = index;
				return this.albumModel = true;
			}
			// 创建
			this.albumForm = {
				name: "",
				order: 0
			}
			this.albumEditIndex = -1;
			this.albumModel = true;

		},
		// 点击确定修改|创建相册
		confirmAlbumModel () {
			// 判断是否为修改
			if (this.albumEditIndex > -1) {
				this.albumEdit();
				return this.albumModel = false;
			}
			this.layout.showLoading()
			// 创建相册
			this.axios.post('/admin/imageclass', this.albumForm, {
				token: true
			}).then(res => {
				// 隐藏表单
				this.albumModel = false;
				this.layout.hideLoading()
				this.$message({
					message: "创建成功",
					type: "success"
				})
				this.__init()
			}).catch(err => {
				this.layout.hideLoading()
			})

		},
		// 修改相册
		albumEdit () {
			let item = this.albums[this.albumEditIndex]
			this.layout.showLoading()
			this.axios.post('/admin/imageclass/' + item.id, this.albumForm, { token: true }
			).then(res => {
				this.$message({
					message: '修改成功',
					type: 'success'
				})
				this.layout.hideLoading()
				this.__init()
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		// 预览图片
		previewImage (item) {
			this.priviewModel = true;
			this.previewUrl = item.url;
		},
		// 修改图片名称
		imageEdit (item, index) {
			this.$prompt('请输入新名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValue: item.name,
				inputValidator (val) {
					if (val === "") {
						return "图片名称不能为空";
					}
				}
			}).then(({ value }) => {
				this.layout.showLoading()
				this.axios.post('/admin/image/' + item.id, {
					name: value
				}, {
					token: true
				}).then(res => {
					this.$message({
						type: "success",
						message: "修改成功"
					})
					this.getImageList()
				}).catch(err => {
					this.layout.hideLoading()
				})
			});
		},
		imageDel (obj) {
			this.$confirm(obj.all ? '是否删除选中图片' : '是否删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.layout.showLoading()
				if (obj.all) {
					let ids = this.chooseList.map(item => item.id);
					this.axios.post('/admin/image/delete_all', {
						ids: ids
					}, {
						token: true
					}).then(res => {
						this.$message({
							message: '删除成功',
							type: 'success'
						})
						this.__init()
						this.chooseList = []
						this.layout.hideLoading()
					}).catch(err => {
						this.layout.hideLoading()
					})
				} else {
					// 删除单个
					this.axios.delete('/admin/image/' + obj.item.id, {
						token: true
					}).then(res => {
						this.$message({
							message: '删除成功',
							type: 'success'
						})
						this.__init()
						this.layout.hideLoading()
					}).catch(err => {
						this.layout.hideLoading()
					})
				}
			});
		},
		handleSizeChange (val) {
			this.pageSize = val
			this.getImageList()
		},
		handleCurrentChange (val) {
			this.currentPage = val
			this.getImageList()
		},
		// 相册分页功能
		changeAlbumPage (type) {
			if (type === 'pre') {
				this.albumPage--
			} else {
				this.albumPage++
			}
			this.__init()
		},
		// 上传成功后的回调
		uploadSuccess (response, file, fileList) {

		}
	}
}
</script>
<style scoped>
.sum-active {
	color: #67c23a;
	background: #f0f9eb;
	border-color: #c2e7b0;
}
</style>