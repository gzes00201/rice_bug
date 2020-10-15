import { TaskService } from './../services/task.service';
import { BarcodeFormat } from '@zxing/library';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.sass']
})
export class ScannerComponent implements OnInit {
  @ViewChild('scanner', { static: true })
  scanner: ZXingScannerComponent;
  showMsg = '';
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasPermission: boolean;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {}


  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
    if (!this.hasDevices) {
      console.log('找不到相机装置');
      // this.modal.open(AlertComponent, {
      //   title: '找不到相机装置',
      //   msg: '不支援本装置',
      //   leftbtn: { text: '确认', color: '#4E88FF' },
      // });
    }
  }

  onHasPermission(has: boolean): void {
    this.hasPermission = has;
    if (!this.hasPermission) {
      console.log('权限错误');
      // this.modal.open(AlertComponent, {
      //   title: '权限错误',
      //   msg: '请打开相机权限',
      //   leftbtn: { text: '确认', color: '#4E88FF' },
      // });
    }
  }

  onCodeResult(resultString: string): void {
    this.go(resultString);
  }

  onDeviceSelectChange(selected: string): void  {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  onDeviceChange(device: MediaDeviceInfo): void  {
    if (device !== null && !this.scanner.isCurrentDevice(device)) {
      this.onDeviceSelectChange(device.deviceId);
    }
  }

  openCameraSelect(): void  {
    if (!this.hasDevices || !this.hasPermission) {
      return;
    }

    const device = this.scanner.device || this.currentDevice;

    // const cameraModal = this.modal.open(FooterSelectComponent, {
    //   list: this.availableDevices.map(item => item.label),
    //   currentIndex: this.availableDevices.map(item => item.deviceId).indexOf(device.deviceId),
    // });
    // cameraModal.onSubmit.subscribe((index) => {
    //   this.onDeviceSelectChange(this.availableDevices[index].deviceId);
    // });
  }

  private go(id: string): void {
    const newMsg = '輸入:' + id;

    this.taskService.checkinTask(id);
    if (newMsg !== this.showMsg) {
      this.showMsg = newMsg;
      setTimeout(() => {
        this.showMsg = '';
      }, 1000);
    }

    // window.parent.location.href = url;
    // this.closeEmit();
  }
}
