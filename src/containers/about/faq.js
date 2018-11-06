import React from 'react'

class Faq extends React.Component {

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render(){

  return (
  <div  style={{marginBottom:0,background:'#FFF'}}>
    <div className="top-book-st">
            <div className="container">
            <div className="row">
            <div className="col-md-12">
              <h1>FAQ Travelsuka</h1>
            </div>
            </div>
            </div>
      </div>
      <div className="container" >
        <ul className="nav nav-tabs">
          {/*<li class="active"><a data-toggle="tab" href="#home">General FAQ</a></li>*/}
          <li><a data-toggle="tab" href="#home" className="active">General FAQ</a></li>
          <li><a data-toggle="tab" href="#menu1" className>Hotel FAQ</a></li>
          <li><a data-toggle="tab" href="#menu2" className>Penerbangan FAQ</a></li>
        </ul>
        <div className="tab-content">
          <div id="home" className="tab-pane fade in active">
            <h3 className="heading">Tentang Travelsuka</h3>
            <ol className="indent-htb">
              <li><b>Mengapa Anda harus membeli tiket pesawat atau voucher hotel di Travelsuka?</b>
                <p className="normal-weight">Travelsuka adalah Agen Travel Online di Indonesia yang menyediakan dan memfasilitasi sistem pemesanan dan pembelian tiket secara online. Travelsuka memberikan Anda kesempatan untuk menemukan informasi tentang produk yang Anda inginkan, melakukan pemesanan, dan melakukan pembayaran online dengan aman melalui beberapa sistem pembayaran dan fasilitas yang telah kami sediakan.</p></li>
              <li><b>Produk-produk apa saja yang dijual oleh Travelsuka?</b>
                <p className="normal-weight">Travelsuka menyediakan AKOMODASI (hotel) &amp; TRANSPORTASI (penerbangan)</p></li>
            </ol>
            <h3 className="heading">Cara Memesan</h3>
            <ol className="indent-htb">
              <li><b>Apakah memungkinkan untuk melakukan pemesanan tanpa menggunakan alamat email?</b>
                <p className="normal-weight">Tidak mungkin. Sebuah pemesanan memerlukan alamat email yang aktif karena e-tiket
                  atau voucher akan dikirim dari sistem kami ke alamat email Anda.</p></li>
              <li><b>Bagaimana saya bisa melakukan pemesanan grup?</b>
                <p className="normal-weight">Untuk pesanan grup, mohon hubungi <span><a href="tel:+62-21-2929-5300">Layanan Pelanggan 24 jam kami.</a></span> </p></li>
              <li><b>Saya melakukan pemesanan untuk dua orang dewasa, satu anak-anak, dan satu bayi. Apakah
                  harga yang ditunjukkan di hasil pencarian merupakan harga total untuk semua penumpang/tamu?</b>
                <p className="normal-weight">
                  Harga yang ditunjukkan di halaman hasil pencarian adalah harga keseluruhan (termasuk pajak dan pelayanan). Anda bisa melihat harga total untuk semua penumpang/tamu setelah Anda klik “Pesan Sekarang” atau "Lanjutkan". Detail harga juga akan ditunjukkan di halaman check out setelah Anda telah mengisi data penumpang/tamu.
                </p></li>
              <li>
                <b>Saya melihat ada promosi harga, tetapi ketika saya mencari promosi harga tersebut,
                  kenapa tidak lagi tersedia?</b>
                <p className="normal-weight">
                  Ketersediaan kursi dan harga promosi untuk setiap produk adalah terbatas. Kami menyarankan 
                  Anda melakukan pemesanan secepatnya sebelum promosi harga selesai.
                </p></li>
            </ol>
            <h3 className="heading">Kelengkapan Data</h3>
            <ol className="indent-htb">
              <li><b>Apakah nama pembeli harus sama dengan nama 
                  penumpang/tamu?</b>
                <p className="normal-weight">Tidak. Nama pembeli dalam informasi kontak pembeli tidak harus sama dengan 
                  nama penumpang/tamu.</p></li>
              <li><b>Bisakah e-tiket saya dikirimkan ke alamat email lainnya?</b>
                <p className="normal-weight">Ya. Silakan hubungi <span><a href="tel:+62-21-2929-5300">Layanan Pelanggan 24 Jam kami</a></span> <span>dan berikan nomor ID pemesanan
                    untuk ini.</span></p></li></ol>
            <h3 className="heading">Pembayaran</h3>
            <ol className="indent-htb">
              <li><b>Apakah Travelsuka menerima pembayaran menggunakan mata uang asing?</b>
                <p className="normal-weight">Tidak, saat ini kami hanya menerima pembayaran dengan mata uang rupiah. Selain pembayaran dengan kartu kredit (VISA, MASTERCARD), kami juga menyediakan pembayaran melalui Transfer Bank ke rekening Bank BCA dan Bank Mandiri.</p></li>
              <li><b>Setelah melakukan pembayaran, bagaimana saya akan menerima e-tiket?</b>
                <p className="normal-weight">Setelah pembayaran diterima dan diverifikasi, sistem Travelsuka akan secara otomatis
                  mengirimkan e-tiket atau voucher ke alamat email Anda. Mohon cetak e-tiket
                  atau voucher hotel dan perlihatkan ketika  melakukan check in. Jangan lupa
                  untuk membawa kartu identitas yang Anda gunakan untuk melengkapi data Anda ketika Anda melakukan
                  pemesanan.</p></li>
              <li><b>Apa yang harus saya lakukan jika saya secara tidak sengaja menghapus e-tiket?</b>
                <p className="normal-weight">
                  Silakan hubungi <span><a href="tel:+62-21-2929-5300">Layanan Pelanggan 24 Jam kami.</a></span> <span>Kami akan membantu Anda dengan mengirimkan ulang 
                    e-tiket atau voucher hotel Anda ke alamat email Anda.</span>
                </p></li>
              <li><b>Jika saya melakukan pembayaran yang tidak sesuai dengan jumlah di invoice, apa yang akan terjadi pada
                  e-tiket atau voucher hotel saya?</b>
                <p className="normal-weight">
                  Jika Anda telah melakukan pembayaran yang lebih atau kurang dari jumlah yang seharusnya Anda bayar,
                  pemesanan Anda tidak akan berhasil dan e-tiket atau voucher Anda tidak akan dikirimkan
                  ke alamat email Anda. Maka, kami menyarankan bahwa Anda membayar sesuai dengan jumlah yang that you pay according
                  tercantum di invoice sehingga e-tiket atau voucher hotel Anda bisa dikirimkan ke alamat email 
                  Anda.
                </p></li>
              <li><b>Apakah pembayaran kartu kredit di Travelsuka aman?</b>
                <p className="normal-weight">
                  Pembayaran kartu kredit di Travelsuka aman karena kami telah mengimplementasikan 3D Secure, kami tidak menyimpan nomor kartu kredit Anda. 
                  Merujuk kepada regulasi PCI-DSS, kami hanya diizinkan untuk menyimpan nomor
                  kode bank (nomor BIN) yang merupakan enam digit pertama dan empat digit terakhir 
                  dari nomor kartu kredit Anda.
                </p></li>
              <li><b>Apakah saya harus melakukan konfirmasi kepada Travelsuka setelah saya melakukan
                  pembayaran?</b>
                <p className="normal-weight">
                  Anda tidak perlu melakukan hal tersebut. Jika Anda telah menerima e-tiket atau voucher, Anda tidak perlu menghubungi kami.
                  Jika Anda tidak menerima e-tiket atau voucher hotel Anda, atau Anda mengalami kesulitan lainnya
                  yang membutuhkan bantuan kami, mohon hubungi kami secepatnya.
                </p></li>
              <li><b>Jika saya memerlukan tanda pembelian untuk kantor saya, bagaimana saya bisa mendapatkannya?</b>
                <p className="normal-weight">
                  Hubungi layanan pelanggan 24 jam kami di 021-29295300, kami akan mengirimkan ulang invoice atau tanda terima ke alamat email anda.
                </p></li>
              <li><b>Saya melakukan pembayaran menggunakan kartu kredit. Seperti apakah proses pengembaliannya jika
                  terjadi pembatalan?</b>
                <p className="normal-weight">
                  Pengembalian uang untuk pembatalan pembayaran kartu kredit hanya bisa diproses
                  dengan nomor kartu kredit yang digunakan untuk pembayaran.
                </p></li></ol>
            <h3 className="heading">Pelayanan</h3>
            <ol className="indent-htb">
              <li><b>Bagaimana saya bisa mengontak Layanan Pelanggan Travelsuka?</b>
                <p className="normal-weight">Anda bisa menghubungi Layanan Pelanggan kami di:
                  <br /><a href="tel:+62-21-2929-5300">Nomor Telepon: 021 2929 5300,</a>
                  <br />email kami di <span><a href="mailto:cs@mykaha.com?Subject=Hello%20again" target="_top">cs@travelsuka</a></span>
                  <br />Atau melalui live chat di website kami 24/7.
                  <br />Petugas Layanan Pelanggan kami akan dengan senang hati melayani Anda.</p></li>
              <li><b>Di manakah alamat kantor Travelsuka?</b>
                <p className="normal-weight">Alamat  kami di:
                  <br />
                  Jl. Pinang Emas III No. E1 - E2 Pondok Indah, Jakarta 12310 - Indonesia. <br />Petugas Layanan Pelanggan kami akan dengan senang hati melayani Anda.</p></li></ol>
          </div>
          <div id="menu1" className="tab-pane fade">
            <h3 className="heading">Ketentuan Umum</h3>
            <ol className="indent-htb">
              <li><b>Hotel apakah yang tersedia melalui Travelsuka?</b>
                <p className="normal-weight">Travelsuka menyediakan lebih dari 200,000 hotel domestik dan internasional.</p></li>
              <li><b>Bagaimana saya mencari hotel di situs Travelsuka?</b>
                <p className="normal-weight">Anda bisa mencari untuk hotel yang Anda inginkan menggunakan destinasi kota atau area. Sistem kami akan mengeluarkan hasil pencarian.</p></li>
              <li><b>Bisakah saya melakukan pemesanan untuk kamar pada malam ini?</b>
                <p className="normal-weight">Ya, Anda bisa. Anda harus tetap memperhatikan waktu check in yang ditentukan dan memberitahu pihak hotel bahwa Anda akan melakukan late check in.</p></li>
              <li><b>Dimanakah saya bisa menemukan nomor telepon hotel?</b>
                <p className="normal-weight">Silakan hubungi Layanan Pelanggan 24 Jam kami. Kami akan dengan senang hati membantu Anda untuk memberitahu nomor kontak nama dan pihak hotel yang bersangkutan jika Anda telah melakukan pembayaran.</p></li>
              <li><b>Bagaimanakah saya tahu ketersediaan kamar pada tanggal yang telah saya pilih?</b>
                <p className="normal-weight">Sistem kami akan secara otomatis menampilkan ketersediaan kamar yang Anda inginkan pada tanggal yang Anda inginkan ketika Anda melakukan pencarian.</p></li>
            </ol>
            {/*                             
                            <h3 class="heading">Cara Memesan</h3>
                            <ol class="indent-htb">
                            <li><b>Cari Hotel</b>
                            <p class="normal-weight">Pilih Hotel atau  tujuan Anda dan kemudian klik "Cari Hotel"</p></li>
                            <div class="search_img">
                                <img src="img-htl1.jpg" class="img-responsive wdtpersen" />
                            </div>
                            <li><b>Pilih Hotel yang Anda Inginkan</b>
                            <p class="normal-weight">Pilih hotel yang diinginkan dengan klik "BOOKING SEKARANG" untuk memilih tipe kamar.</p></li>
                            <div class="search_img">
                                <img src="img-htl2.jpg" class="img-responsive wdtpersen" />
                            </div>
                            <li><b>Lengkapi Pemesanan</b>
                            <p class="normal-weight">Isi informasi secara detail dan lengkapi pemesanan Anda kemudian klik tombol &quot;SUBMIT&quot;</p></li>
                            <div class="search_img">
                                <img src="img-htl3.jpg" class="img-responsive wdtpersen"> </div>
                            <li><b>Pilih Metode Pembayaran</b>
                              <p class="normal-weight">Pilih metode pembayaran yang Anda inginkan, Kartu Kredit atau Transfer Bank kemudian klik &quot;BAYAR SEKARANG&quot;</p></li>
                            <div class="search_img">
                                <img src="img-htl4.jpg" class="img-responsive wdtpersen"> </div>
                            <li><b>Menerima E-Voucher</b>
                            <p class="normal-weight">Setelah pembayaran berhasil dilakukan dan kami menerima pembayaran Anda, e-voucher akan dikirimkan secara otomatis ke email Anda.</p></li>
                            </ol>
                             
 */}                           
            <h3 className="heading">Metode Pembayaran</h3>
            <ol className="indent-htb">
              <li><b>Saya tidak memiliki kartu kredit. Bagaimana saya bisa melakukan pembayaran untuk kamar hotel yang telah saya pesan?</b>
                <p className="normal-weight">Bila anda tidak memiliki kartu kredit, kami menyediakan jenis pembayaran melalui Transfer Bank yang sudah tertera di pilihan pembayaran.</p></li>
            </ol>
            <h3 className="heading">Harga dan Biaya Tambahan</h3>
            <ol className="indent-htb">
              <li><b>Apakah pajak dan biaya layanan termasuk di dalam harga kamar hotel di Travelsuka?</b>
                <p className="normal-weight">Ya. Harga kamar hotel yang terdaftar di Travelsuka termasuk biaya pajak dan layanan.</p></li>
              <li><b>Jika saya membawa lebih banyak tamu dari yang diperkirakan untuk setiap kamar, apakah saya akan dikenakan harga lebih?</b>
                <p className="normal-weight">Anda bisa melihat peraturan untuk jumlah tamu di satu kamar hotel ketika Anda melakukan pemesanan. Jika Anda membawa jumlah tamu lebih banyak dari yang disebutkan, Anda bisa memberitahu pihak hotel. Semua biaya yang dikenakan dari penambahan jumlah tamu ditentukan oleh pihak hotel.</p></li>
              <li><b>Apakah harga hotel yang saya bayar termasuk sarapan?</b>
                <p className="normal-weight">Hal ini tergantung dari tipe kamar hotel yang telah Anda pesan. Anda bisa melihat hal ini ketika memilih jenis kamar dan harga. Sistem kami akan menampilkan jenis kamar dan harga yang dipilih termasuk sarapan atau tidak. Anda juga bisa melihat detail ketersediaan sarapan pada voucher Anda.</p></li>
              <li><b>Saya membawa anak-anak saya, apakah saya akan dikenakan biaya tertentu?</b>
                <p className="normal-weight">Ada perbedaan batas umur untuk anak-anak di setiap hotel. Biaya tambahan, jika ada, ditentukan oleh masing-masing hotel.</p></li>
              <li><b>Apakah pembayaran kartu kredit di Travelsuka aman?</b>
                <p className="normal-weight">Pembayaran dengan kartu kredit di Travelsuka adalah aman karena kami tidak menyimpan nomor kartu kredit Anda. Merujuk kepada regulasi PCI-DSS, kami hanya diizinkan untuk menyimpan nomor kode bank (nomor BIN), yang merupakan enam angka pertama dan empat angka terakhir dari nomor kartu kredit Anda.</p></li>
            </ol>
            <h3 className="heading">Permintaan Khusus</h3>
            <ol className="indent-htb">
              <li><b>Bisakah saya membuat permintaan khusus untuk hotel yang saya pesan?</b>
                <p className="normal-weight">Jika Anda mempunyai permintaan khusus, Anda bisa memasukkan hal tersebut dalam kolom “permintaan khusus” ketika Anda melengkapi keterangan tentang tamu. Travelsuka tidak bisa menjamin bahwa semua permintaan akan dipenuhi oleh pihak hotel. Kebijakan dan biaya yang muncul dari permintaan khusus akan menjadi tanggung jawab hotel yang bersangkutan.</p></li>
              <li><b>Apakah harga hotel yang saya bayar termasuk biaya pengantaran ke dan dari airport?</b>
                <p className="normal-weight">Anda bisa melihat fasilitas pengantaran airport ketika Anda melakukan pemesanan. Jika hotel yang Anda pesan tidak menyediakan fasilitas tersebut, Anda bisa mengajukan permintaan khusus di kolom "permintaan khusus". Biaya yang muncul adalah ketentuan hotel.</p></li>
              <li><b>Bisakah saya melakukan check-in lebih awal atau check-out lebih telat?</b>
                <p className="normal-weight">Anda bisa menghubungi hotel secara langsung untuk konfirmasi. Biaya yang muncul adalah ketentuan hotel.</p></li>
              <li><b>Bisakah saya meminta tempat tidur ekstra untuk pesanan saya?</b>
                <p className="normal-weight">Permintaan untuk tempat tidur ekstra bisa dimasukkan di kolom "permintaan khusus". Ketersediaan dan harga yang muncul adalah ketentuan dari masing-masing hotel.</p>
              </li><li><b>Bisakah saya meminta permintaan khusus seperti “ruang rokok”, “tempat tidur bayi”, atau jenis tempat tidur yang saya inginkan?</b>
                <p className="normal-weight">Semua permintaan khusus bisa diajukan di kolom "permintaan khusus". Travelsuka tidak bisa menjamin bahwa permintaan akan dipenuhi oleh pihak hotel. Kebijakan dan biaya yang muncul dari permintaan khusus akan menjadi tanggung jawab hotel.</p></li>
            </ol>
            <h3 className="heading">Perubahan dan Pembatalan</h3>
            <ol className="indent-htb">
              <li><b>Bisakah saya merubah tanggal menginap atau membatalkan pemesanan saya?</b>
                <p className="normal-weight">Perubahan atau pembatalan pemesanan akan mengikuti kebijakan dari masing-masing hotel. Travelsuka akan menampilkan kebijakan pembatalan ketika Anda melakukan pemesanan. Jika Anda membutuhkan informasi lebih lanjut mengenai kebijakannya, mohon hubungi Layanan Pelanggan 24 Jam kami.</p></li>
            </ol>
          </div>
          <div id="menu2" className="tab-pane fade">
            <h3 className="heading">Ketentuan Umum</h3>
            <ol className="indent-htb">
              <li><b>Jika saya melakukan kesalahan ketika memasukkan nama penumpang, apa yang seharusnya saya lakukan?</b>
                <p className="normal-weight">Jika ada kesalahan pada nama penumpang sebelum melakukan pembayaran maka anda dapat mengabaikannya dan membuat reservasi baru dengan nama yang benar. Namun jika sudah melakukan pembayaran dan menerima e-ticket, Silahkan hubungi layanan pelanggan 24 jam kami.</p></li>
              <li><b>Saya tidak memasukkan nama lengkap saya sesuai dengan kartu identitas saya di kolom Nama Penumpang, apa yang seharusnya saya lakukan?</b>
                <p className="normal-weight">Mohon menghubungi <span><a href="tel:+62-21-2929-5300">Layanan Pelanggan 24 Jam kami.</a></span> <span>Petugas layanan pelanggan kami akan membantu memperbaiki nama sesuai dengan syarat dan ketentuan yang berlaku.</span></p></li>
              <li><b>Passport saya akan habis masa berlakunya dalam kurang dari enam bulan,  bisakah saya melakukan pemesanan untuk
                  penerbangan internasional?</b>
                <p className="normal-weight">Menurut regulasi maskapai penerbangan, sebuah passport sebagai identifikasi penumpang 
                  harus masih berlaku setidaknya untuk enam bulan. Penumpang dengan passport yang mempunyai masa berlaku
                  kurang dari enam bulan tidak diizinkan untuk melakukan perjalanan wisata ke luar negeri.</p></li>
              <li><b>Bagaimana saya mengubah tanggal keberangkatan dari tiket yang telah saya beli?</b>
                <p className="normal-weight">Silahkan hubungi layanan pelanggan 24 jam kami. Biaya administrasi untuk perubahan dalam tanggal keberangkatan
                  diatur oleh maskapai penerbangan yang bersangkutan.</p></li>
            </ol>
            {/*                   
                         
      <h3 class="heading">Cara Memesan</h3>
                            <ol class="indent-htb">
                            <li><b>Cari Penerbangan</b>
                            <p class="normal-weight">Pilih kota asal dan kota tujuan, isi jumlah penumpang, tentukan tanggal keberangkatan, kelas penerbangan dan pilih &quot;Satu Arah&quot; atau &quot;Pulang Pergi&quot; tergantung kebutuhan Anda, setelah selesai klik "Cari Penerbangan"</p></li>
                            <div class="search_img">
                              <img src="img-fl1.jpg" class="img-responsive wdtpersen" />
                            </div>
                            <li><b>Pilih Penerbangan</b>
                            <p class="normal-weight">Pada halaman hasil pencarian pilih penerbangan yang cocok dan klik "PILIH" lalu akan muncul popup Konfirmasi Pembelian Tiket, cek dengan teliti kemudian klik "PESAN".</p></li>
                            <div class="search_img">
                              <img src="img-fl2.jpg" class="img-responsive wdtpersen" /><br><img src="img-fl3.jpg" class="img-responsive wdtpersen" />
                            </div>
                            <li><b>Detail Penumpang</b>
                            <p class="normal-weight">Isi formulir wajib dengan informasi yang sesuai dengan kartu identitas Anda yang masih berlaku.</p></li>
                            <div class="search_img">
                                <img src="img-fl4.jpg" class="img-responsive wdtpersen" />
                            </div>
                            <li><b>Pembayaran</b>
                            <p class="normal-weight">Pilih metode pembayaran Anda dan kemudian klik "BAYAR" untuk mengeluarkan e-tiket</p></li>
                            <div class="search_img">
                                <img src="img-fl5.jpg" class="img-responsive wdtpersen" />
                            </div>
                            <li><b>E-tiket Diterima</b>
                            <p class="normal-weight">Setelah pembayaran berhasil dan kami menerima pembayaran Anda, e-ticket akan dikirimkan secara otomatis ke email Anda. Jika Anda tidak menerima e-ticket, Anda bisa mengecek pesanan Anda di <span><a href="">pemesanan saya</a></span> <span>, atau Anda bisa mengontak</span> <span><a href="tel:+62-21-2929-5300">Layanan Pelanggan 24 Jam kami.</a></span> </p></li>
                            </ol>
                        
                    
       */}                
            <h3 className="heading">Kategori Penumpang</h3>
            <ol className="indent-htb">
              <li><b>Berapakah batasan umur untuk anak-anak dan bayi untuk pesanan tiket pesawat?</b>
                <p className="normal-weight">Batas usia untuk bayi adalah rata-rata dari 0 sampai 23 bulan dan untuk anak-anak dari 24 bulan sampai 12 tahun dan 11 bulan (tergantung dari regulasi maskapai penerbangan yang bersangkutan).</p></li>
              <li><b>Apakah prosedur pemesanan tiket untuk ibu yang sedang mengandung?</b>
                <p className="normal-weight">Ibu yang sedang mengandung diharapkan untuk memperlihatkan keterangan medis dari dokter
                  ketika melakukan check in di bandara, menyatakan bahwa ia diizinkan untuk terbang. Batasan
                  usia kehamilan yang diizinkan untuk penerbangan udara tergantung dari regulasi maskapai penerbangan
                  yang bersangkutan.</p></li>
              <li><b>Bisakah saya melakukan pemesanan untuk seorang anak yang tidak ditemani oleh penumpang dewasa?</b>
                <p className="normal-weight">Anda tidak bisa. Pesanan tiket pesawat untuk kategori anak-anak harus ditemani oleh satu penumpang
                  dewasa.</p></li>
            </ol>
            <h3 className="heading">Harga</h3>
            <ol className="indent-htb">
              <li><b>Untuk pemesanan tiket pesawat, apakah ada perbedaan harga antara tiket untuk
                  bayi dan tiket untuk anak-anak?</b>
                <p className="normal-weight">Harga untuk anak-anak dan bayi berbeda, tergantung dari regulasi setiap maskapai penerbangan. 
                  Anda bisa melihat detail harga untuk anak-anak dan bayi setelah Anda melengkapi data penumpang dan tekan tombol "tambahkan ke kantung belanja".
                  Anda akan ditunjukkan detail penerbangan Anda dan detail harga dari setiap penumpang.</p></li>
              <li><b>Mengapa harga tiket pesawat terus berubah-ubah?</b>
                <p className="normal-weight">Harga tiket pesawat sering berubah. Semua perubahan harga mengikuti ketentuan dari penerbangan yang bersangkutan.</p></li>
            </ol>
            <h3 className="heading">Check In</h3>
            <ol className="indent-htb">
              <li><b>Ketika saya melakukan pembayaran menggunakan kartu kredit, apakah saya harus memperlihatkan
                  kartu kredit ketika melakukan check in di bandara?</b>
                <p className="normal-weight">Hal ini tidak harus dilakukan. Anda hanya harus memperlihatkan kode pemesanan dan kartu identitas Anda yang masih berlaku
                  ketika melakukan check in di bandara.</p></li>
            </ol>
          </div>
          {/* <div id="menu3" class="tab-pane fade">
      <h3>Menu 3</h3>
      <p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>*/}
        </div>
      </div>
      <br/><br/><br/><br/><br/><br/>
      

    </div>
    )}
}

export default Faq
