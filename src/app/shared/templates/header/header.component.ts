// @ts-ignore
import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {ProfileService} from '../../services/profile.service';
import {AuthService} from '../../services/auth.service';
import {Router} from "@angular/router";
import {SettingsStorageService} from "../../consts/settingsStorage";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User = new User();
  menuState!: boolean;
  @Input() titleHeader: string | undefined;

  constructor(
      private profileService: ProfileService,
      private authService: AuthService,
      private router: Router,
      public settingsStorageService: SettingsStorageService,
  ) { }

  ngOnInit(): any {
    /** Rajoute les settings **/
    this.settingsStorageService.getStorageSettings();
  }

  logOut(): any {
    document.location.reload();
    this.authService.logOut();
  }

  navigateSettings(): any{
    this.router.navigate(['/settings']);
  }

}


