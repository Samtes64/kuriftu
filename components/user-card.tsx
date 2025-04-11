/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {  useSession } from "@/lib/auth-client";
import { Session } from "@/lib/auth-types";

import {
	Award,
	Edit,
	
	FileBadge,
	
	Loader2,
	
	MedalIcon,
	
	Trophy,
	
	TrophyIcon,
	
	X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";


import { Badge } from "@/components/ui/badge";




export default function UserCard(props: {
	session: Session | null;
	activeSessions: Session["session"][];
	
}) {

	const { data } = useSession();
	const session = data || props.session;
	
	
	return (
		<Card>
			<CardHeader>
				<CardTitle>User</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-8 grid-cols-1">
				<div className="flex flex-col gap-2">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="hidden h-9 w-9 sm:flex ">
								<AvatarImage
									src={session?.user.image || undefined}
									alt="Avatar"
									className="object-cover"
								/>
								<AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="grid">
								<div className="flex items-center gap-1">
									<p className="text-sm font-medium leading-none">
										{session?.user.name}
									</p>
									
										<Badge
											className="w-min p-px rounded-full"
											variant="outline"
										>
											<Award className="w-5 h-5 text-yellow-400"/>
										</Badge>
								
								</div>
								<p className="text-sm">{session?.user.email}</p>
							</div>
						</div>
						<EditUserDialog />
					</div>
					<div className="flex items-center justify-between">
						<div>
							
						</div>
						
					</div>
				</div>

				

				
			</CardContent>
			
		</Card>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}


function EditUserDialog() {
	const { data } = useSession();
	const [name, setName] = useState<string>();
	const router = useRouter();
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	const [open, setOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2" variant="secondary">
					<Edit size={13} />
					Edit User
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] w-11/12">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>Edit user information</DialogDescription>
				</DialogHeader>
				<div className="grid gap-2">
					<Label htmlFor="name">Full Name</Label>
					<Input
						id="name"
						type="name"
						placeholder={data?.user.name}
						required
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
					<div className="grid gap-2">
						<Label htmlFor="image">Profile Image</Label>
						<div className="flex items-end gap-4">
							{imagePreview && (
								<div className="relative w-16 h-16 rounded-sm overflow-hidden">
									<Image
										src={imagePreview}
										alt="Profile preview"
										layout="fill"
										objectFit="cover"
									/>
								</div>
							)}
							<div className="flex items-center gap-2 w-full">
								<Input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="w-full text-muted-foreground"
								/>
								{imagePreview && (
									<X
										className="cursor-pointer"
										onClick={() => {
											setImage(null);
											setImagePreview(null);
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button
						disabled={isLoading}
						
					>
						{isLoading ? (
							<Loader2 size={15} className="animate-spin" />
						) : (
							"Update"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
